import { Sequelize } from 'sequelize-typescript';
import { Company } from './tables/company';
import { User } from './tables/user';
import { UserValues } from './tables/user_values';
import { Users } from './tables/users';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT as any,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME || 'test3',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  models: [Company, User, UserValues, Users],
  logging: false,
});

Company.hasMany(User, { foreignKey: 'company_id' });
User.belongsTo(Company, { foreignKey: 'company_id' });

User.hasMany(UserValues, { foreignKey: 'user_id' });
UserValues.belongsTo(User, { foreignKey: 'user_id' });

Users.hasMany(User, { foreignKey: 'main_id' });
User.belongsTo(Users, { foreignKey: 'main_id' });

Users.hasMany(UserValues, { foreignKey: 'main_id' });
UserValues.belongsTo(Users, { foreignKey: 'main_id' });

UserValues.belongsTo(Company, { foreignKey: 'company_id' });
Company.hasMany(UserValues, { foreignKey: 'company_id' });
