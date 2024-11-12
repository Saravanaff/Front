import { Sequelize } from 'sequelize-typescript';
import { Company } from './tables/company';
import { User } from './tables/user';
import { UserValues } from './tables/user_values';
import {Users} from './tables/users';
export const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    database: 'test3',
    username: 'root',
    password: '',
    models: [Company, User, UserValues,Users],
    logging: false
});
Company.hasMany(User, { foreignKey: 'company_id' });
User.belongsTo(Company, { foreignKey:'company_id' });
User.hasMany(UserValues, { foreignKey: 'user_id' });
UserValues.belongsTo(User, { foreignKey: 'user_id' });
Users.hasMany(User,{foreignKey:'main_id'});
User.belongsTo(Users,{foreignKey:'main_id'});
Users.hasMany(UserValues,{
    foreignKey:'main_id'
});
UserValues.belongsTo(Users,{
    foreignKey:'main_id'
})

UserValues.belongsTo(Company,{
    foreignKey:'company_id'
})
Company.hasMany(UserValues, { foreignKey: 'company_id' });
