// TODO: Name 以外は getter ではなかったが, 多分すべて getter ではないか

export interface IFunctionBase{
    get Name(): string;
    length: number;
    name: string;
    get Type(): string;
}
