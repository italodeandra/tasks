export default function asyncMap<T, R>(arr: T[], predicate: (item: T) => Promise<R>): Promise<R[]>;
