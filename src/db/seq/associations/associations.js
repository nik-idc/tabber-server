const { credentials } = require('../models');
const { user } = require('../models');
const { tab } = require('../models');

module.exports = function () {
	credentials.hasOne(user, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		foreignKey: {
			allowNull: false
		}
	});
	user.belongsTo(credentials);

	user.hasMany(tab, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		foreignKey: {
			allowNull: false
		}
	});
	tab.belongsTo(user);
};
