// @ts-nocheck
import { LocalNotificationServiceOptions, Logger, NotificationTypes } from "@platform/framework/types";
import { AbstractNotificationProviderService } from "@platform/framework/utils";
type InjectedDependencies = {
    logger: Logger;
};
interface LocalServiceConfig {
}
export declare class LocalNotificationService extends AbstractNotificationProviderService {
    static identifier: string;
    protected config_: LocalServiceConfig;
    protected logger_: Logger;
    constructor({ logger }: InjectedDependencies, options: LocalNotificationServiceOptions);
    send(notification: NotificationTypes.ProviderSendNotificationDTO): Promise<NotificationTypes.ProviderSendNotificationResultsDTO>;
}
export {};
//# sourceMappingURL=local.d.ts.map




