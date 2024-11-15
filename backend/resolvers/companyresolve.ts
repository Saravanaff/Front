import { Resolver, Mutation, Arg, Query,Int} from 'type-graphql';
import { CompanyType } from '../types/companytypes';
import { CreateCompanyInput } from '../types/inputs';
import { Company } from '../tables/company';
import {User} from '../tables/user';
import {Users} from '../tables/users'
import { DelCom } from '../types/inputs';
import { Void } from 'graphql-scalars/typings/mocks';
import { UserValues } from '../tables/user_values';
import { error } from 'console';

@Resolver()
export class CompanyResolver {
  @Mutation(() => CompanyType)
  async createOrUpdateCompany(
    @Arg('input') input: CreateCompanyInput
  ): Promise<CompanyType> {
    const { column_name, company_id,nam } = input;
    const id=await Users.findOne({where:{name:nam}});
      const main_id=id.dataValues.id;
    console.log(input);
    const newColumn: any[] = column_name ? [column_name] : [];

    let company = await Company.findOne({ where: { id: company_id,main_id:main_id } });

    if (company) {
      let existingColumnData:any = company.column_name || [];
      console.log(typeof(existingColumnData));
      if (existingColumnData==company.column_name){
      let cl=JSON.stringify(existingColumnData);
      let ex=JSON.parse(cl);
      existingColumnData=JSON.parse(ex)}
      existingColumnData.push(...newColumn);
      console.log('Hello');
      const string=JSON.stringify(existingColumnData);
       Company.update(
        { column_name: string },
        { where: { id: company_id,main_id:main_id} }
       ).then(()=>{
        console.log("Successfully Updated");
       }).catch((err)=>{
        console.log(err);
       })
    } else {
      company = await Company.create({
        id: company_id,
        column_name: newColumn,
        main_id:main_id
      });
    }

    return company;
  }
  @Query(()=>[CompanyType])
  async getcompany(@Arg('nam') nam:string):Promise<CompanyType[]>{
    const id=await Users.findOne({where:{name:nam}});
      const main_id=id.dataValues.id;
    return await Company.findAll({where:{main_id:main_id}});
  }

  @Query(() => CompanyType, { nullable: true })
  async company(
    @Arg('company', () => String) company: string,
    @Arg('nam') nam:string
  ): Promise<CompanyType | null> {
    const id=await Users.findOne({where:{name:nam}});
      const main_id=id.dataValues.id;
    const company1 = await Company.findOne({ where: { company_name: company,main_id:main_id} });
    return company1;
  }

  @Mutation(type => Boolean)
  async delcom(@Arg('input') input: DelCom): Promise<boolean> {
    try {
      const { company_name,nam} = input;
      console.log(company_name);
      console.log(nam)
      const id=await Users.findOne({where:{name:nam}});
      const main_id=id.dataValues.id;
  
      const company = await Company.findOne({ where: { company_name:company_name,main_id:main_id} });
  
      if (!company) {
        throw new Error(`Company with name ${company_name} not found.`);
      }
  
      await UserValues.destroy({ where: { company_id: company.id,main_id:main_id} });
      console.log("data_values");
      await User.destroy({ where: { company_id: company.id,main_id:main_id } });
      console.log("data");
      await Company.destroy({ where: { id: company.id,main_id:main_id} });
      console.log("Company");
      return true;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to delete company and related data.");
    }
  }
  @Mutation(type=>Boolean)
  async createcom(@Arg('input') input:DelCom){
    try{
      const {company_name,nam}=input;
      const id=await Users.findOne({where:{name:nam}});
      const main_id=id.dataValues.id;
      console.log(input)
      await Company.create({
        company_name:company_name,
        main_id:main_id
      });
      console.log("Company created successfully");
    }
    catch(err){
      console.error(err);
      throw new error("Company not Created");
    }
  }
  @Query(() => CompanyType, { nullable: true })
  async getCompanyById(@Arg("company") company: string,@Arg("nam") nam:string): Promise<CompanyType | null> {
    try {
      console.log(company);

      const id=await Users.findOne({where:{name:nam}});
      console.log("companybyid");
      console.log(id);
      if(id){
      const main_id=id.dataValues.id;
      console.log("companybyid");
      const compan = await Company.findOne({ where: {company_name:company,main_id:main_id} });
      console.log(compan);
      return compan;}
      else{
        return null;
      }
    } catch (error) {
      console.error("Error fetching company by ID:", error);
      throw new Error("Failed to fetch company by ID");
    }
  }
  @Query(() => CompanyType, { nullable: true })
  async getCompany(@Arg("company2") company2: string,@Arg("nam") nam:string): Promise<CompanyType | null> {
    try {
      console.log(company2);
      const id=await Users.findOne({where:{name:nam}});
      if(id){
      const main_id=id.dataValues.id;
      const compan = await Company.findOne({ where: {company_name:company2,main_id:main_id} });
      console.log(compan);
      return compan;}
      else{
        return null
      }
    } catch (error) {
      console.error("Error fetching company by ID:", error);
      throw new Error("Failed to fetch company by ID");
    }
  }
  
}

