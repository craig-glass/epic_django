from django.shortcuts import render
from .models import Post
from django.views.generic import ListView
# Create your views here.


class BlogView(ListView):
    model = Post
    template_name = 'blog.html'
    context_object_name = 'blog_posts'