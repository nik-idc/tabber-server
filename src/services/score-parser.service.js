const { Midi } = require("@tonejs/midi");
const fs = require("fs");
const { utilService } = require("./util.service");

const noteNames = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const noteTypes = [
  { value: 1 / 1, beats: 4 }, // 1
  { value: 1 / 2, beats: 2 }, // 1/2
  { value: 1 / 4, beats: 1 }, // 1/4
  { value: 1 / 8, beats: 0.5 }, // 1/8
  { value: 1 / 16, beats: 0.25 }, // 1/16
  { value: 1 / 32, beats: 0.125 }, // 1/32
  { value: 1 / 64, beats: 0.0625 }, // 1/64
  { value: 1 / 2 + 1 / 4, beats: 3 }, // 1/2d
  { value: 1 / 4 + 1 / 8, beats: 1.5 }, // 1/4d
  { value: 1 / 8 + 1 / 16, beats: 0.75 }, // 1/8d
  { value: 1 / 16 + 1 / 32, beats: 0.375 }, // 1/16d
  { value: 1 / 32 + 1 / 64, beats: 0.1875 }, // 1/32d
  { value: 1 / 64 + 1 / 128, beats: 0.09375 }, // 1/64d
  { value: 1 / 2 + 1 / 4, beats: 3.5 }, // 1/2dd
  { value: 1 / 4 + 1 / 8, beats: 1.75 }, // 1/4dd
  { value: 1 / 8 + 1 / 16, beats: 0.875 }, // 1/8dd
  { value: 1 / 16 + 1 / 32, beats: 0.4375 }, // 1/16dd
  { value: 1 / 32 + 1 / 64, beats: 0.21875 }, // 1/32dd
  { value: 1 / 64 + 1 / 128, beats: 0.109375 }, // 1/64dd
  // Triplet duration is 1/3 of its 'parent' duration
  { value: (1 / 1) * (1 / 3), beats: 4 * (1 / 3) }, // 1/2t
  { value: (1 / 2) * (1 / 3), beats: 2 * (1 / 3) }, // 1/4t
  { value: (1 / 4) * (1 / 3), beats: 1 * (1 / 3) }, // 1/8t
  { value: (1 / 8) * (1 / 3), beats: (1 / 2) * (1 / 3) }, // 1/16t
  { value: (1 / 32) * (1 / 3), beats: (1 / 4) * (1 / 3) }, // 1/32t
  { value: (1 / 64) * (1 / 3), beats: (1 / 8) * (1 / 3) }, // 1/64t
];

const commonTunings = [
  [64, 59, 55, 50, 45, 40], // E4 B3 G3 D3 A2 E2 - Standard
  [64, 59, 55, 50, 45, 38], // Drop D
  [62, 57, 53, 48, 43, 36], // Drop C
  [60, 55, 51, 46, 41, 34], // Drop A
  [62, 57, 53, 48, 43, 38], // D Standard
  [60, 55, 51, 46, 41, 36], // C Standard
  [59, 54, 50, 45, 40, 35], // B Standard
  [64, 59, 55, 50, 45, 40, 35], // 7-string Standard (Low B)
  [64, 59, 55, 50, 45, 40, 38], // 7-string Drop A
  [64, 59, 55, 50, 45, 40, 35, 28], // 8-string Standard (F#)
  [64, 59, 55, 50, 45, 40, 38, 26], // 8-string Drop E
  [64, 59, 55, 50, 45, 40, 33], // Open Cmaj7 (C G C G B E)
  [64, 59, 55, 50, 45, 36], // DADGAD (D2 A2 D3 G3 A3 D4)
  [64, 59, 55, 50, 47, 38], // Midwest Emo: D G C F A D (Drop C#)
  [64, 59, 55, 50, 43, 38], // Drop C#
  [64, 59, 55, 50, 45, 43], // E standard w/ low D#
];

/**
 * Transforms a MIDI file into tabber format data using Tone.js MIDI-to-JSON parser
 */
class MidiToScoreService {
  /**
   * Transforms a MIDI file into tabber format data using Tone.js MIDI-to-JSON parser
   * @param {string} pathToMidi Path to the MIDI file
   */
  constructor(pathToMidi) {
    const midiFile = fs.readFileSync(pathToMidi);
    const parsedTonejs = new Midi(midiFile);

    this.header = parsedTonejs.header;
    this.tracks = parsedTonejs.tracks;
    this.ppq = this.header.ppq;
    this.tempos = this.header.tempos;
    this.timeSignatures = this.header.timeSignatures;
    this.bars = this.#generateBars();
  }

  /**
   * Generates bars from provided in ctor MIDI data
   * @returns Bars array
   */
  #generateBars() {
    // Notes from all tracks sorted by time in ascending order
    const notes = this.tracks
      .flatMap((track) => {
        return track.notes;
      })
      .sort((a, b) => {
        return a.ticks - b.ticks;
      });

    const bars = [];
    for (let i = 0; i < this.timeSignatures.length; i++) {
      const current = this.timeSignatures[i];
      current.timeSignature;
      const next = this.timeSignatures[i + 1];
      const startTick = current.ticks;
      // const endTick = next ? next.ticks : current.ticks + 1;
      const endTick = next ? next.ticks : notes[notes.length - 1].ticks;
      const beats = current.timeSignature[0];
      const noteVal = current.timeSignature[1];
      const barLengthTicks = this.ppq * 4 * (beats / noteVal);

      // Create bar with all necessary info and empty beats array
      let t = startTick;
      while (t < endTick) {
        const tempo = this.#getTempoAtTick(t);
        bars.push({
          startTick: t, // For processing, will be 'undefined'-ed after all is done
          endTick: t + barLengthTicks, // For processing, will be 'undefined'-ed after all is done

          tempo: tempo,
          beatsCount: beats,
          duration: 1 / noteVal,
          beats: [],
        });
        t += barLengthTicks;
      }
    }
    return bars;
  }

  /**
   * Gets tempo at specific tick of the track
   * @param {number} tick Tick
   * @returns BPM at tick
   */
  #getTempoAtTick(tick) {
    let selected = this.tempos[0]?.bpm || 120;
    for (let i = 0; i < this.tempos.length; i++) {
      const tempoEvent = this.tempos[i];
      if (tick >= tempoEvent.ticks) {
        selected = tempoEvent.bpm;
      } else {
        break;
      }
    }
    return selected;
  }

  /**
   * Detects most fitting tuning considering all the provided notes
   * @param {number[]} noteMIDINumbers Array of MIDI note numbers
   * @param {number} stringCount String count
   * @param {number} maxFret - Max fret considered playable (default 24)
   * @param {number} maxStringSpan - Max distance between strings used (optional)
   * @returns Best fitting tuning
   */
  #detectBestTuning(
    noteMIDINumbers,
    stringCount = 6,
    maxFret = 24,
    maxStringSpan = 2
  ) {
    let bestFit = undefined;
    let bestScore = -Infinity;
    const scores = [];

    for (let tuning of commonTunings) {
      if (tuning.length !== stringCount) {
        continue;
      }

      let matchedCount = 0;
      let usedStrings = [];
      for (let note of noteMIDINumbers) {
        let fretFound = false;
        for (let stringIdx = 0; stringIdx < tuning.length; stringIdx++) {
          const fret = note - tuning[stringIdx];
          if (fret >= 0 && fret <= maxFret) {
            matchedCount++;
            usedStrings.push(stringIdx);
            fretFound = true;
            break; // First string that works
          }
        }

        if (!fretFound) {
          // If one note can't be played, this tuning might not be valid
          break;
        }
      }

      if (matchedCount !== noteMIDINumbers.length) {
        continue;
      }

      const span =
        usedStrings.length > 1
          ? Math.max(...usedStrings) - Math.min(...usedStrings)
          : 0;
      const spanPenalty = span > maxStringSpan ? (span - maxStringSpan) * 2 : 0;
      const score = matchedCount - spanPenalty;
      scores.push(score);

      if (score > bestScore) {
        bestScore = score;
        bestFit = tuning;
      }
    }

    if (bestFit !== undefined) {
      return bestFit;
    }

    // Fallback: build a tuning starting from the lowest MIDI note
    const minNote = Math.min(...noteMIDINumbers);
    const fallbackTuning = [];
    let current = minNote;
    for (let i = 0; i < stringCount; i++) {
      fallbackTuning.push(current);
      current += i === 3 ? 4 : 5; // Approximate standard pattern: 5, 5, 5, 4, 5
    }

    return fallbackTuning;
  }

  /**
   * Creates a deep copy of current bars
   */
  #barsDeepCopy = () => {
    const bars = [];
    for (const bar of this.bars) {
      bars.push({
        startTick: bar.startTick,
        endTick: bar.endTick,

        tempo: bar.tempo,
        beatsCount: bar.beatsCount,
        duration: bar.duration,
        beats: [],
      });
    }

    return bars;
  };

  /**
   * Assigns note to best fitting string
   * @param {number} noteMidiNumber Note MIDI number
   * @param {number[]} tuning Tuning, array of MIDI note numbers (from highest to lowest)
   * @returns Object with note string number and fret
   */
  #assignNoteToString(noteMidiNumber, tuning) {
    // const maxStretch = 4;
    for (let s = 0; s < tuning.length; s++) {
      const fret = noteMidiNumber - tuning[s];
      if (fret >= 0 && fret <= 24) {
        return { string: s + 1, fret };
      }
    }
    return null;
  }

  /**
   * Takes a midi note and transforms it intp a note name and octave pair
   * @param {number} noteMidiNumber Note MIDI number
   * @returns Object with note name and octave
   */
  #midiToNote(noteMidiNumber) {
    return {
      noteValue: noteNames[noteMidiNumber % 12],
      octave: Math.floor(noteMidiNumber / 12) - 1,
    };
  }

  /**
   * Quantizes raw duration
   * @param {number} duration Raw MIDI duration in seconds
   * @param {number} bpm Beats Per Minute
   * @returns Closest note duration
   */
  #quantizeDuration(duration, bpm) {
    const beatDuration = 60 / bpm;

    let closest = noteTypes[0];
    let minDiff = Infinity;
    for (let i = 0; i < noteTypes.length; i++) {
      const type = noteTypes[i];
      const diff = Math.abs(type.beats * beatDuration - duration);
      if (diff < minDiff) {
        closest = type;
        minDiff = diff;
      }
    }
    return closest.value;
  }

  /**
   * Builds a tabber-like note object
   * @param {any} guitar Guitar
   * @param {number | undefined} stringNum String number (1-to-*max number of strings*)
   * @param {number | undefined} fret Fret
   * @param {{noteValue:string, octave: number | undefined}} stringInfo
   * @returns tabber-like note object
   */
  #buildGuitarNote(guitar, stringNum, fret, stringInfo) {
    return {
      stringNum: stringNum,
      fret: fret,
      note: {
        noteValue: stringInfo.noteValue,
        octave: stringInfo.octave,
      },
      effects: [],
    };
  }

  /**
   * Generates an empty tabber-like beat
   * @param {any} guitar Guitar
   * @returns tabber-like beat
   */
  #buildEmptyBeat(guitar) {
    const notes = [];
    for (let i = 0; i < guitar.stringsCount; i++) {
      notes.push(
        // this.#buildGuitarNote(guitar, i + 1, undefined, { noteValue: "" })
        null
      );
    }

    return {
      quantizedDurations: [0.25], // For processing, will be 'undefined'-ed after all is done

      duration: 1 / 4,
      notes: notes,
    };
  }

  /**
   * Process Tone.js MIDI-to-JSON track
   * @param {import("@tonejs/midi").TrackJSON} track Track
   */
  #processTrack(track) {
    const tuning = this.#detectBestTuning(track.notes.map((n) => n.midi));
    const guitar = {
      tuning: tuning.map((midi) => ({
        noteValue: this.#midiToNote(midi).noteValue,
        octave: this.#midiToNote(midi).octave,
      })),
      stringsCount: tuning.length,
      fretsCount: 24,
    };

    const bars = this.#barsDeepCopy();
    for (const bar of bars) {
      bar.guitar = guitar;
    }

    for (const bar of bars) {
      // Find all the notes that belong in current bar
      // If no such notes are present then simply continue
      const barNotes = track.notes.filter((note) => {
        return note.ticks >= bar.startTick && note.ticks < bar.endTick;
      });
      if (barNotes.length === 0) {
        continue;
      }

      // Process each note of the bar
      for (const note of barNotes) {
        const beatDurationTicks = this.ppq;
        const beatIndex = Math.floor(
          (note.ticks - bar.startTick) / beatDurationTicks
        );

        if (bar.beats[beatIndex] === undefined) {
          bar.beats[beatIndex] = this.#buildEmptyBeat(guitar);
        }

        const stringInfo = this.#assignNoteToString(note.midi, tuning);
        if (stringInfo === null) {
          continue;
        }

        const tabberNote = this.#midiToNote(note.midi);
        const duration = this.#quantizeDuration(note.duration, bar.tempo);

        if (bar.beats[beatIndex].quantizedDurations === undefined) {
          bar.beats[beatIndex].quantizedDurations = [duration];
        } else {
          bar.beats[beatIndex].quantizedDurations.push(duration);
        }

        bar.beats[beatIndex].notes[stringInfo.string - 1] =
          this.#buildGuitarNote(
            guitar,
            stringInfo.string,
            stringInfo.fret,
            tabberNote
          );
      }
    }

    for (const bar of bars) {
      bar.startTick = undefined;
      bar.endTick = undefined;

      for (let i = 0; i < bar.beats.length; i++) {
        if (bar.beats[i] === null || bar.beats[i] === undefined) {
          bar.beats[i] = this.#buildEmptyBeat(guitar);
          //   bar.beats[i].quantizedDurations = [0.25];
        }
      }
    }

    for (const bar of bars) {
      if (bar.beats.length === 0) {
        for (let i = 0; i < bar.beatsCount; i++) {
          const notes = [];
          for (let j = 0; j < bar.guitar.stringsCount; j++) {
            notes.push(null);
          }

          bar.beats.push({
            uuid: utilService.randomInt(),
            duration: bar.duration,
            quantizedDurations: [bar.duration],
            notes: notes,
          });
        }
      }

      for (const beat of bar.beats) {
        beat.duration = Math.max(...beat.quantizedDurations);
        beat.quantizedDurations = undefined;
      }
    }

    return {
      uuid: utilService.randomInt(),
      name: this.header.name,
      instrumentName: track.instrument.name,
      guitar: guitar,
      bars: bars,
    };
  }

  /**
   * Transform data
   * @param {string | number} id ID of the score
   * @param {string} name Name of the score
   * @param {string} artist Artist
   * @param {string} song Song title
   * @param {boolean} isPublic True if public
   * @returns Transformed data
   */
  convert(id, name, artist, song, isPublic) {
    const tabs = this.tracks.map((track) => {
      return this.#processTrack(track);
    });

    return {
      id: id,
      name: name,
      artist: artist,
      song: song,
      isPublic: isPublic,
      tracks: tabs,
    };
  }
}

module.exports = MidiToScoreService;
