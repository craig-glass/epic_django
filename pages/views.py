import json
import os

from django.core.files import File
from django.http import HttpResponse, JsonResponse
from django.template import loader

from .models import Pages


def index(request):
    template = loader.get_template('pages/page_index.html')
    context = {}
    return HttpResponse(template.render(context, request))


def page(request, page_id):
    """ Read page of the given id and redirect to page_display template with page data """
    template = loader.get_template('pages/page_display.html')
    selected_page = Pages.objects.get(page_id=page_id)
    context = {
        'page_name': selected_page.page_name,
        'page_data': json.loads(selected_page.file.read())
    }
    return HttpResponse(template.render(context, request))


def add_page(request):
    template = loader.get_template('pages/page_add.html')
    context = {}
    return HttpResponse(template.render(context, request))


def get_page_count_ajax(request):
    count = Pages.objects.count()
    return JsonResponse({"count": count})


def get_pages_ajax(request):
    pages = list(Pages.objects.values_list('page_id', 'page_name', flat=False).order_by('page_id', 'page_name')
                 [int(request.POST.get("start", 0)):int(request.POST.get("stop", 10))])
    return JsonResponse({"pages": pages})


def save_ajax(request):
    """
    Take json format page data and store as new page in database
    Respond with either success or failure message
    """
    if request.method == 'POST':
        page_data = json.loads(request.POST.get('page data', None).replace("'", '"'))
        new_page = Pages(page_name=page_data['name'])
        new_page.save()  # Save to auto generate id for use in file name
        filename = str(new_page.page_id) + '.json'
        with open(filename, 'w+') as f:
            f.write(str(page_data['records']).replace("'", '"'))
            new_page.file = File(f)
            new_page.save()
        os.remove(filename)
        return JsonResponse({"page_id": str(new_page.page_id)})
    return JsonResponse({"responseText": "Invalid method " + request.method}, status=500)
