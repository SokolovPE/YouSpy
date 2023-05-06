import "reflect-metadata";

import { Container } from "inversify";
import SERVICE_IDENTIFIER from "@/constants/identifiers";
import TAG from "@/constants/tags";
import { IUserService } from "@/interfaces/IUserService";
import { ISpentTimeService } from "@/interfaces/ISpentTimeService";
import { YTUserService } from "@/services/YTUserService";
import { YTSpentTimeService } from "@/services/YTSpentTimeService";

let container = new Container();

container.bind<IUserService>(SERVICE_IDENTIFIER.IUserService).to(YTUserService);//.whenTargetNamed(TAG.YT);
container.bind<ISpentTimeService>(SERVICE_IDENTIFIER.ISpentTimeService).to(YTSpentTimeService);

export default container;