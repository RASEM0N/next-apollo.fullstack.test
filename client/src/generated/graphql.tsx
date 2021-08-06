import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  postCreate: Post;
  postUpdate?: Maybe<Post>;
  postDelete: Scalars['Boolean'];
  userRegister: User;
  userLogin?: Maybe<User>;
};


export type MutationPostCreateArgs = {
  title: Scalars['String'];
};


export type MutationPostUpdateArgs = {
  title?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};


export type MutationPostDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationUserRegisterArgs = {
  input: UserInput;
};


export type MutationUserLoginArgs = {
  input: UserInput;
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['ID'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  postGetAll: Array<Post>;
  postGetById?: Maybe<Post>;
  userMe?: Maybe<User>;
};


export type QueryPostGetByIdArgs = {
  id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  input: UserInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', userLogin?: Maybe<{ __typename?: 'User', id: string, username: string, createdAt: string, updatedAt: string }> };

export type RegisterMutationVariables = Exact<{
  password: Scalars['String'];
  username: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', userRegister: { __typename?: 'User', id: string, username: string, createdAt: string, updatedAt: string } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', userMe?: Maybe<{ __typename?: 'User', id: string, username: string, createdAt: string, updatedAt: string }> };


export const LoginDocument = gql`
    mutation Login($input: UserInput!) {
  userLogin(input: $input) {
    id
    username
    createdAt
    updatedAt
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterDocument = gql`
    mutation Register($password: String!, $username: String!) {
  userRegister(input: {password: $password, username: $username}) {
    id
    username
    createdAt
    updatedAt
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const MeDocument = gql`
    query Me {
  userMe {
    id
    username
    createdAt
    updatedAt
  }
}
    `;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};