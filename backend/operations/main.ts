import { Request, Response } from 'express';
import { User } from '../tables/user';
import { UserValues } from '../tables/user_values';
import {Company} from '../tables/company';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, age, hobby, company_id, column_value, pair } = req.body;
        if (!name || !age || !hobby || !company_id) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        const object: { [key: string]: any } = {};
        for (let i = 0; i < pair.length; i++) {
            object[pair[i]] = column_value[i];
        }

        const user = await User.create({ name, age, hobby, company_id, column_values: object });

        for (let i = 0; i < pair.length; i++) {
            await UserValues.create({ user_id: user.id, keys: pair[i], values: column_value[i] });
        }

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Error creating user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const num = req.params.id;
        await User.destroy({ where: { id: num } });
        await UserValues.destroy({ where: { user_id: num } });
        res.status(200).send("Deleted");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting user' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const { name, age, hobby, company_id, column_value, pair } = req.body;

        if (!name || !age || !hobby || !company_id) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        const updatedUser = await User.update(
            { name, age, hobby, company_id },
            { where: { id: userId } }
        );

        if (updatedUser[0] === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingValues = await UserValues.findAll({ where: { user_id: userId } });

        for (let i = 0; i < pair.length; i++) {
            const key = pair[i];
            const value = column_value[i];
            const existingValue = existingValues.find(item => item.keys === key);
            if (existingValue) {
                await UserValues.update(
                    { values: value },
                    { where: { id: existingValue.id } }
                );
            } else {
                await UserValues.create({ user_id: userId, keys: key, values: value });
            }
        }

        const updatedColumnValues: { [key: string]: any } = {};
        for (let i = 0; i < pair.length; i++) {
            updatedColumnValues[pair[i]] = column_value[i];
        }

        await User.update(
            { column_values: updatedColumnValues },
            { where: { id: userId } }
        );

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Error updating user' });
    }
};

export const getUserData = async (req: Request, res: Response) => {
    try {
        const companyName = req.query.company as string;
        let users: User[] = [], columnNames: string[] = [];
        if (companyName) {
            const company = await Company.findOne({ where: { company_name: companyName } });
            if (!company) {
                return res.status(404).json({ error: 'Company not found' });
            }

            users = await User.findAll({ where: { company_id: company.id } });
            columnNames = company.column_name || [];
            for (let user of users) {
                const additionalValues = await UserValues.findAll({
                    where: { user_id: user.id },
                    attributes: ['keys', 'values']
                });

                user.dataValues.additionalValues = additionalValues.reduce((acc: any, { keys, values }) => {
                    acc[keys] = values;
                    return acc;
                }, {});
            }
        } else {
            users = await User.findAll();
        }

        res.status(200).json({ users, columnNames });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Error fetching data' });
    }
};

export const updateCompany = async (req: Request, res: Response) => {
    try {
        const { column_name, company_id } = req.body;
        
        const company = await Company.findOne({ where: { id: company_id } });
        if (company) {
            const newColumn = column_name || "";
            let existingColumnData: string[] = company.column_name || [];
            existingColumnData.push(newColumn);
            await Company.update(
                { column_name: existingColumnData },
                { where: { id: company_id } }
            );

            res.status(201).json({ message: 'Company updated successfully' });
        } else {
            res.status(404).json({ error: 'Company not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating company' });
    }
};
