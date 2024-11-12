import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";
import { UserType } from "../types/usertypes";
import { UsersSign } from "../types/userstypes";
import { UserValuesType } from "../types/user_valuestypes";
import {Users} from '../tables/users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import {
  CreateUserInput,
  UpdateUserInput,
  GetUsersArgs,
} from "../types/inputs";
import { User } from "../tables/user";
import { UserValues } from "../tables/user_values";
import { Company } from "../tables/company";
import {UserSign} from '../types/inputs';
import { error } from "console";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(@Args() { company,nam}: GetUsersArgs): Promise<User[]> {
    let users: User[] = [];
    console.log(company);
    console.log("name",nam);
    const id=await Users.findOne({where:{name:nam}});
      const main_id=id.dataValues.id;
    if (company) {
      console.log(company);
      const companyInstance = await Company.findOne({
        where: { company_name: company,main_id:main_id},
      });
      if (!companyInstance) {
        throw new Error("Company not found");
      }
      console.log(companyInstance.id);
      users = await User.findAll({ where: { company_id: companyInstance.id,main_id:main_id } });
    } else {
      users = await User.findAll({where:{main_id:main_id}});
    }

    return Promise.all(
      users.map(async (user) => {
        const additionalValues = await UserValues.findAll({
          where: { user_id: user.id },
          attributes: ["keys", "values"],
        });
        user.dataValues.additionalValues = additionalValues.map(
          ({ keys, values }) => ({
            keys,
            values: values !== null ? values : "",
          })
        );

        const columnValuesArray = user.column_values
          ? JSON.parse(JSON.stringify(user.column_values))
          : null;

        const userType: User = {
          ...user.dataValues,
          column_values: columnValuesArray,
        };

        return userType;
      })
    );
  }
  @Mutation(() => UsersSign)
  async create(@Arg("input") input: UserSign): Promise<UserSign> {
    try {
      const { name, email, password } = input;
      console.log(name,email,password);
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await Users.create({
        name,
        email,
        password: hashedPassword, 
      });
  
      console.log("User Created Successfully");
      return user;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to create user");
    }
  }
  @Mutation(() => UsersSign)
async Sign(@Arg("input") input: UserSign): Promise<UsersSign> {
    try {
        const { email, password } = input;
        console.log(email, password);

        const user = await Users.findOne({ where: { email } });

        if (!user) {
            console.log("User does not exist");
            throw new Error("Invalid email or password"); 
        }

        const valid = await bcrypt.compare(password, user.password);

        if (valid) {
            const token = jwt.sign(
              { name: user.name, email: user.email },
              process.env.JWT_SECRET,  
              { expiresIn: "1h" } 
          );
            console.log(token);
            return {
                name: user.name ?? '',   
                email: user.email ?? '',  
                password: '',
                token            
            };
        } else {
            console.log("Invalid password");
            throw new Error("Invalid email or password");
        }
    } catch (err) {
        console.error(err);
        throw new Error("Failed to sign in"); 
    }
}

  @Mutation(() => UserType)
async updateUser(@Arg("input") input: UpdateUserInput): Promise<UserType> {
  try {
    console.log("Update");
    const { id, name, age, hobby, company_id, column_value, pair,nam} = input;
    console.log(input);
    const ide=await Users.findOne({where:{name:nam}});
    const main_id=ide.dataValues.id;

    await User.update(
      { name, age, hobby, company_id },
      { where: { id,main_id } }
    );

    console.log("User Updated Successfully");
    const existingValues = await UserValues.findAll({ where: { user_id: id,main_id:main_id } });
    if (existingValues && Array.isArray(existingValues)) {
      for (let i = 0; i < pair.length; i++) {
        const key = pair[i];
        const value = column_value[i];
        const existingValue = existingValues.find((item) => item.keys === key);

        if (existingValue) {
          await UserValues.update(
            { values: value },
            { where: { id: Number(existingValue.id),main_id:main_id} }
          );
        } else {
          await UserValues.create({ user_id: id, keys: key, values: value,main_id:main_id });
        }
      }
    } else {
      for (let i = 0; i < pair.length; i++) {
        const key = pair[i];
        const value = column_value[i];
        await UserValues.create({ user_id: id, keys: key, values: value });
      }
    }

    const updatedUser = await User.findOne({ where: { id } });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser as UserType;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update user");
  }
}

  @Mutation(() => UserType)
async createUser(@Arg("input") input: CreateUserInput): Promise<User> {
  const { name, age, hobby, company_id, column_value, pair,nam} = input;
  console.log("input", input);
  console.log(nam);
  const id=await Users.findOne({where:{name:nam}});
  const main_id=id.dataValues.id;
  console.log(main_id);

  try {
    const user = await User.create({
      name,
      age,
      hobby,
      company_id,
      main_id,
    });

    console.log("Success created");

    if (column_value && pair) {
      const use = await User.findOne({
        where: { name: name, age: age, hobby: hobby, company_id: company_id,main_id:main_id},
      });

      if (use) {
        const u = use.toJSON(); 

        for (let i = 0; i < pair.length; i++) {
          await UserValues.create({
            user_id: u.id,
            keys: pair[i],
            values: column_value[i],
            main_id:main_id,
            company_id:company_id
          });
          console.log("created successfully");
        }
      }
    }

    return user;

  } catch (err) {
    console.error(err);
    throw new Error("Failed to create user"); 
  }
}


  @Mutation(() => Boolean)
  async deleteUser(@Arg("id") id:number): Promise<boolean> {
    try{
    await User.destroy({ where: { id:id } });
    await UserValues.destroy({ where: { user_id: id } }).then(()=>{
      console.log("Deleted");
    }).catch((err)=>{
      console.error(err);
    })
    return true;
  }

catch(err){
  console.error(err);
  throw new error("cannot delete user");
}
  }
  
}

