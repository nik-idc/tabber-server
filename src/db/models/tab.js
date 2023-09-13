module.exports = (sequelize, DataTypes) => {
	const Tab =  sequelize.define('tab', {
		artist: {
			type: DataTypes.STRING
		},
		song: {
			type: DataTypes.STRING,
			allowNull: false
		},
		guitar: {
			type: DataTypes.JSON,
			allowNull: false
		},
		bars: {
			type: DataTypes.JSON,
			allowNull: false
		},
		public: {
			type: DataTypes.BOOLEAN,
            allowNull: false,
			defaultValue: false
		}
	}, {
		timestamps: false
	});

	return Tab;
}