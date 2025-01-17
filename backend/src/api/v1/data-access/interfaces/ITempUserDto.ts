export interface ITempUserDto {
  id: string;
  name: string;
  email: string;
  authType?: string;
  password: string;
  key?: string;
  createdAt?: Date;
}

export interface INewTempUserDto {
  name: string;
  email: string;
  authType?: string;
  password: string;
  key?: string;
  createdAt?: Date;
}

export interface IMakeTempUserModel {
  findByEmail: (email: string) => Promise<ITempUserDto | null>;
  findByUserId: (id: string) => Promise<ITempUserDto | null>;
  findByKey: (key: string) => Promise<ITempUserDto | null>;

  createNew: (user: INewTempUserDto) => Promise<ITempUserDto>;
  updateCurrent: (user: ITempUserDto) => Promise<ITempUserDto>;
  deleteCurrent: (id: string) => Promise<ITempUserDto>;
}
