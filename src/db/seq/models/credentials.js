module.exports = (sequelize, DataTypes) => {
	const Credentials = sequelize.define('credentials', {
		email: {
			type: DataTypes.STRING,
            allowNull: false,
			// validate: {
			// 	isEmail: true
			// }
		},
		password: {
			type: DataTypes.STRING,
            allowNull: false,
			// validate: {
			// 	is: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}/
			// }
		}
	}, {
		timestamps: false,
	});

	return Credentials;
}