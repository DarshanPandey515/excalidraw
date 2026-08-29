import uuid

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from drawing.models import Board, DrawingObject
from drawing.serializers import LoginSerializer, SignupSerializer, BoardSerializer


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            {
                "message": "User created successfully.",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(
            {
                "message": "Login successful.",
                **serializer.validated_data,
            },
            status=status.HTTP_200_OK,
        )


class BoardListCreateView(APIView):
    """List the current user's boards or create a new one."""

    def get(self, request):
        boards = Board.objects.filter(user=request.user).order_by("-created_at")
        return Response({"boards": BoardSerializer(boards, many=True).data})

    def post(self, request):
        name = request.data.get("name", "").strip()
        if not name:
            return Response(
                {"detail": "Board name is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        board = Board.objects.create(name=name, user=request.user)
        return Response(
            BoardSerializer(board).data,
            status=status.HTTP_201_CREATED,
        )


class BoardDetailView(APIView):
    """Get or delete a single board owned by the current user."""

    def get_object(self, request, board_id):
        return get_object_or_404(Board, id=board_id, user=request.user)

    def get(self, request, board_id):
        board = self.get_object(request, board_id)
        elements = list(
            board.drawing_objects.order_by("position").values_list("points", flat=True)
        )
        return Response(
            {
                "board": BoardSerializer(board).data,
                "elements": elements,
            }
        )

    def delete(self, request, board_id):
        board = self.get_object(request, board_id)
        board.delete()
        return Response(
            {"message": "Board deleted."},
            status=status.HTTP_204_NO_CONTENT,
        )


class BoardElementsView(APIView):
    """Get or replace all drawing elements for a board."""

    def get_object(self, request, board_id):
        return get_object_or_404(Board, id=board_id, user=request.user)

    def get(self, request, board_id):
        board = self.get_object(request, board_id)
        elements = list(
            board.drawing_objects.order_by("position").values_list("points", flat=True)
        )
        return Response({"elements": elements})

    def put(self, request, board_id):
        board = self.get_object(request, board_id)
        elements = request.data.get("elements")
        if not isinstance(elements, list):
            return Response(
                {"detail": "'elements' must be a list."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        board.drawing_objects.all().delete()
        DrawingObject.objects.bulk_create(
            [
                DrawingObject(
                    id=uuid.uuid4(),
                    board=board,
                    user=request.user,
                    tool=str(el.get("type", "pen"))[:20],
                    points=el,
                    stroke=str(el.get("color", "#df4b26")),
                    stroke_width=el.get("strokeWidth", 5),
                    position=i,
                )
                for i, el in enumerate(elements)
            ]
        )
        return Response(
            {"message": "Elements saved successfully.", "count": len(elements)}
        )