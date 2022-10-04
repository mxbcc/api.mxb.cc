import { Controller, Get, Param, Res } from "@nestjs/common";
import { ResourceService } from "../services";

@Controller('/apis/packages')
export class PackageController {
    constructor(
        private readonly resourceService: ResourceService,
    ) {
    }

    @Get('/:pkgId')
    async getPackage(@Param('pkgId') pkgId: string, @Res() res) {
        const url = await this.resourceService.getPackage(pkgId);
        res.redirect(url);
    }
}
