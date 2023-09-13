module.exports = (sequelize, DataTypes) => {
	const Credentials = sequelize.define('credentials', {
		email: {
			type: DataTypes.STRING,
            allowNull: false,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
            allowNull: false,
			validate: {
				// Don't know what the 'i' at the end does but validation fails without it
				is: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,30}/i
			}
		}
	}, {
		timestamps: false,
	});

	return Credentials;
}