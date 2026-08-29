from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from drawing.models import CustomUser, Board, DrawingObject


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = CustomUser
        fields = ["email", "password", "name"]

    def create(self, validated_data: dict) -> CustomUser:
        return CustomUser.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data["name"],
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs: dict) -> dict:
        user = authenticate(
            email=attrs["email"],
            password=attrs["password"],
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "This account is inactive."
            )

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
            },
        }


class BoardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Board
        fields = [
            "id",
            "name",
            "created_at"
        ]
        read_only_fields = [
            "id",
            "created_at"
        ]


class DrawingObjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = DrawingObject
        fields = [
            "id",
            "board",
            "user",
            "tool",
            "points",
            "stroke",
            "stroke_width",
            "position",
            "created_at",
        ]
        read_only_fields = ["id", "user", "created_at"]