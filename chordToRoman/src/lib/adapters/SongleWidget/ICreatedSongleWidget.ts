import { IDataset } from "./ISongleWidget/IDataset";
export interface ICreatedSongleWidget {
    dataset: IDataset,
    mode: string,
    source: string,
    status: string,
    uuid: string,
}
