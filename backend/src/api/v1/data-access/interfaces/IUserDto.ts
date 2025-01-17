export interface IUserDto {
  id: string;
  name: string;
  email: string;
  publicId: string;
  authType?: string;
  password: string;
  googleId?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  key?: string;
  keyCreatedAt?: Date;
  createdAt?: Date;
}

export interface INewUserDto {
  name: string;
  email: string;
  authType?: string;
  password: string;
  googleId?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  key?: string;
  keyCreatedAt?: Date;
}

export interface IUpdateUser {
  id: string;
  name?: string;
  password?: string;
  key?: string;
  keyCreatedAt?: Date;
}

export interface INewOAuthUserDto {
  name: string;
  email: string;
  authType: string;
  password?: string;
  googleId: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  key?: string;
  keyCreatedAt?: Date;
}

export interface IMakeUserModel {
  findByEmail: (email: string) => Promise<IUserDto | null>;
  findByUserId: (id: string) => Promise<IUserDto | null>;
  findByPublicId(publicId: string): Promise<IUserDto | null>;
  findByKey: (key: string) => Promise<IUserDto | null>;

  createNew: (user: INewUserDto) => Promise<IUserDto>;
  createNewOAuth: (user: INewOAuthUserDto) => Promise<IUserDto>;
  updateCurrent: (user: IUpdateUser) => Promise<IUserDto>;
  deleteCurrent: (id: string) => Promise<IUserDto>;
}
