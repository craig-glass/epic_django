from django.contrib import admin
from .models import Modules, ModuleSubsections, ModuleUsers, SubsectionPages

admin.site.register(Modules)
admin.site.register(ModuleSubsections)
admin.site.register(ModuleUsers)
admin.site.register(SubsectionPages)
