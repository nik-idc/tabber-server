module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
		username: {
			type: DataTypes.STRING,
		}
	}, {
		timestamps: false,
	});

	return User;
}