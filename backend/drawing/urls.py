from django.urls import path
from drawing.views import (
    SignupView,
    LoginView,
    BoardListCreateView,
    BoardDetailView,
    BoardElementsView,
)

urlpatterns = [
    path("auth/signup/", SignupView.as_view(), name="signup"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("boards/", BoardListCreateView.as_view(), name="board-list"),
    path("boards/<uuid:board_id>/", BoardDetailView.as_view(), name="board-detail"),
    path("boards/<uuid:board_id>/elements/", BoardElementsView.as_view(), name="board-elements"),
]