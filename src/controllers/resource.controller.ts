import { Controller, Param, Post } from "@nestjs/common";
import { ResourceService } from "../services";

@Controller('/apis/resources')
export class ResourceController {
    constructor(
        private readonly resourceService: ResourceService,
    ) {
    }

    @Post('/:itemId/likes')
    async likeResource(@Param('itemId') itemId: string) {
        await this.resourceService.likeResource(itemId);
    }
}
