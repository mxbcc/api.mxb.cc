import { Controller, Get, Param, Post, Res } from "@nestjs/common";
import { ResourceService } from "../services";

@Controller('/apis/resources')
export class ResourceController {
    constructor(
        private readonly resourceService: ResourceService,
    ) {
    }

    @Post('/:resourceId/likes')
    async likeResource(@Param('resourceId') resourceId: string) {
        await this.resourceService.likeResource(resourceId);
    }

    @Get('/:resourceId/packages/:pkgId')
    async getPackage(
        @Param('resourceId') resourceId: string,
        @Param('pkgId') pkgId: string,
        @Res() res,
    ) {
        const url = await this.resourceService.getPackage(resourceId, pkgId);
        res.redirect(url);
    }
}
