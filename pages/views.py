from django.http import HttpResponse
from django.template import loader


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
