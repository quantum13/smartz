from django.urls import path

from apps.contracts_uis.views import ContractUIsList, AddToDashboardView

urlpatterns = [
    path('', ContractUIsList.as_view(), name='contracts-uis-list'),
    path('/<slug:id>/add-to-dashboard', AddToDashboardView.as_view(), name='contracts-uis-add-to-dashboard'),
]
