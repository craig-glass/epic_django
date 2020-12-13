from django.contrib import admin
from .models import Modules, Contents, ModuleUsers, ContentsPages

admin.site.register(Modules)
admin.site.register(Contents)
admin.site.register(ModuleUsers)
admin.site.register(ContentsPages)
