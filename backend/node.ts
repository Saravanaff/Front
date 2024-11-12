import express, { Request, Response } from 'express';
import { Sequelize, Model, Column, DataType, Table, ForeignKey } from 'sequelize-typescript';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());

@Table({
    tableName: "company",
    timestamps: false
})
class Company extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    id!: number;

    @Column({
        type: DataType.STRING
    })
    company_name?: string;

    @Column({
        type: DataType.JSON,
        defaultValue: []
    })
    column_name?: string[];
}
@Table({
    tableName: 'user',
    timestamps: false
})
class User extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    id!: number;

    @Column({
        type: DataType.STRING
    })
    name!: string;

    @Column({
        type: DataType.INTEGER
    })
    age!: number;

    @Column({
        type: DataType.STRING
    })
    hobby!: string;

    @ForeignKey(() => Company)
    @Column({
        type: DataType.INTEGER
    })
    company_id!: number;

    @Column({
        type: DataType.JSON,
        defaultValue: {}
    })
    column_values?: { [key: string]: any };
}

@Table({
    tableName: 'user_values',
    timestamps: false
})
class UserValues extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    id!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    user_id!: number;

    @Column({
        type: DataType.STRING
    })
    keys!: string;

    @Column({
        type: DataType.STRING
    })
    values!: string;
}

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    database: 'test3',
    username: 'root',
    password: '',
    models: [Company, User, UserValues],
    logging: false
});
Company.hasMany(User, { foreignKey: 'company_id' });
User.belongsTo(Company, { foreignKey: 'company_id' });
User.hasMany(UserValues, { foreignKey: 'user_id' });
UserValues.belongsTo(User, { foreignKey: 'user_id' });
sequelize.sync().then(() => {
    console.log("Tables Created");
}).catch((err) => {
    console.error('Error syncing the database:', err);
});

app.post('/create', async (req: Request, res: Response) => {
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
});

app.post('/company', async (req: Request, res: Response) => {
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
});

app.delete('/delete/:id', async (req: Request, res: Response) => {
    try {
        const num = parseInt(req.params.id, 10);
        await User.destroy({ where: { id: num } });
        await UserValues.destroy({ where: { user_id: num } });
        res.status(200).send("Deleted");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

app.put('/update/:id', async (req: Request, res: Response) => {
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
});

app.get('/data', async (req: Request, res: Response) => {
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

                user.dataValues.additionalValues = additionalValues.reduce((acc:any, { keys, values }) => {
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
});
app.listen(5500, () => {
    console.log("Server running on port 5500");
});