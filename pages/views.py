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
        'page_id': page_id,
        'page_name': selected_page.page_name,
        'page_data': json.loads(selected_page.file.read())
    }
    return HttpResponse(template.render(context, request))


def add_page(request):
    return edit_page(request, None)


def edit_page(request, page_id):
    template = loader.get_template('pages/page_add.html')
    context = {
        'page_id': json.dumps(page_id)
    }
    return HttpResponse(template.render(context, request))


def get_page_count_ajax(request):
    count = Pages.objects.count()
    return JsonResponse({'count': count})


def get_pages_ajax(request):
    pages = list(Pages.objects.values_list('page_id', 'page_name', flat=False).order_by('page_id', 'page_name')
                 [int(request.POST.get('start', 0)):int(request.POST.get('stop', 10))])
    return JsonResponse({'pages': pages})


def save_ajax(request):
    """
    Take json format page data and store as new page in database
    Respond with either success or failure message
    """
    if request.method == 'POST':
        page_data = json.loads(request.POST.get('page_data', None))
        page_id = request.POST.get('page_id', None)
        if page_id:
            overwrite_page = Pages.objects.get(page_id=page_id)
            with open(overwrite_page.file.path, "w+") as f:
                f.write(str(page_data['records']))
            return JsonResponse({'page_id': str(page_id), 'overwrite': True})
        else:
            new_page = Pages(page_name=page_data['name'])
            new_page.save()  # Save to auto generate id for use in file name
            filename = str(new_page.page_id) + '.json'
            with open(filename, 'w+') as f:
                f.write(json.dumps(page_data['records']))
                new_page.file = File(f)
                new_page.save()
            os.remove(filename)
            return JsonResponse({'page_id': str(new_page.page_id), 'overwrite': False})
    return JsonResponse({'responseText': 'Invalid method ' + request.method}, status=500)


def get_page_data_ajax(request):
    if request.method == 'POST':
        page_id = request.POST.get('page_id', 'null')
        if page_id == 'null':
            return JsonResponse({
                'page_name': '',
                'page_data': ''
            })
        selected_page = Pages.objects.get(page_id=page_id)
        if selected_page:
            return JsonResponse({
                'page_name': selected_page.page_name,
                'page_data': json.loads(selected_page.file.read())
            })
    return JsonResponse({"responseText": 'Invalid method ' + request.method}, status=500)


def delete_page_ajax(request):
    if request.method == 'POST':
        page_id = request.POST.get('page_id', 'null')
        Pages.objects.get(page_id=page_id).delete()
        return JsonResponse({})
    return JsonResponse({"responseText": 'Invalid method ' + request.method}, status=500)
