module.exports = (sequelize, DataTypes) => {
	const Tab =  sequelize.define('tab', {
		artist: {
			type: DataTypes.STRING
		},
		song: {
			type: DataTypes.STRING,
			allowNull: false
		},
		data: {
			type: DataTypes.JSON,
			allowNull: false
		}
	}, {
		timestamps: false
	});

	return Tab;
}