from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.core.files import File

import os
import json

from .models import Pages


def index(request):
    template = loader.get_template('pages/page_index.html')
    context = {}
    return HttpResponse(template.render(context, request))


def page(request):
    template = loader.get_template('pages/page_display.html')
    context = {
        'page_id': request.GET['page_id']
    }
    print(context['page_id'])
    return HttpResponse(template.render(context, request))


def add_page(request):
    template = loader.get_template('pages/page_add.html')
    context = {}
    return HttpResponse(template.render(context, request))


def save_ajax(request):
    """
    Take json format page data and store as new page in database
    Respond with either success or failure message
    """
    if request.method == "POST":
        page_data = json.loads(request.POST.get("page data", None).replace("'", '"'))
        new_page = Pages(page_name=page_data["name"])
        new_page.save()  # Save to auto generate id for use in file name
        filename = str(new_page.page_id) + ".json"
        with open(filename, "w+") as f:
            f.write(str(page_data["records"]).replace("'", '"'))
            new_page.file = File(f)
            new_page.save()
        os.remove(filename)
        return JsonResponse({"page_id": str(new_page.page_id)})
    return JsonResponse({"responseText": "Invalid method " + request.method}, status=500)
