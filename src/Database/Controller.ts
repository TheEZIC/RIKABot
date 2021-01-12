import { Repository } from "typeorm";

export default abstract class Controller<T> {
    constructor(
        public repository: Repository<T>,
    ) {}
}