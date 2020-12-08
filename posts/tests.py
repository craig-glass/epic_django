from django.test import TestCase
from django.urls import reverse

from .models import Post

# Create your tests here.


class PostModelTest(TestCase):

    def setUp(self):
        Post.objects.create(text='this is a test')

    def test_text_content(self):
        post = Post.objects.get(id=1)
        expected_object_name = f'{post.text}'
        self.assertEqual(expected_object_name, 'this is a test')


class BlogViewTest(TestCase):

    def setUp(self):
        Post.objects.create(text='another test')

    def test_view_url_exists_at_correct_location(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_view_url_by_name(self):
        response = self.client.get(reverse('blog'))
        self.assertEqual(response.status_code, 200)

    def test_view_uses_correct_template(self):
        response = self.client.get(reverse('blog'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'blog.html')

