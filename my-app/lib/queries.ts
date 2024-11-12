import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers($company: String,$nam:String) {
    users(company: $company,nam:$nam) {
      id
      name
      age
      hobby
      company_id
      additionalValues {
        keys
        values
      }

    }
    
  }

`;

export const GET_COLUMN=gql`
  query Getcolumn($company:String!,$nam:String!){
    company(company:$company,nam:$nam){
      id
      company_name
      column_name
    }
  }
`
export const GET_COMPANY=gql`
  query ($nam:String!) {
    getcompany(nam:$nam){
    company_name
    id
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      age
      hobby
      company_id
      additionalValues {
        keys
        values
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      age
      hobby
      company_id
      additionalValues {
        keys
        values
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: Float!) {
    deleteUser(id: $id)
  }
`;

export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createOrUpdateCompany(input: $input) {
      id
      company_name
      column_name
    }
  }
`;
export const REG_USER=gql`
mutation RegisterUser($input: UserSign!) {
  create(input: $input) {
    name
    email
    password
  }
}
`;
export const LOG_USER=gql`
mutation SignUser($input: UserSign!) {
  Sign(input: $input) {
    name
    email
    password
    token
  }
}
`;
export const Del_COM=gql`
  mutation DeleteCom($input:DelCom!){
    delcom(input:$input)
  }
`;
export const CREATE_COM=gql`
mutation CreateCom($input:DelCom!){
    createcom(input:$input)}
`;

export const GET_COM=gql`
query GetCompanyById($company: String!,$nam:String!) {
  getCompanyById(company: $company,nam:$nam) {
    id
  }
}`;

export const GET_CO=gql`
query get_Company($company2:String!,$nam:String!){
  getCompany(company2:$company2,nam:$nam){
    id
  }
}
`;


