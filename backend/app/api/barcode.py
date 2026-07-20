from fastapi import APIRouter, HTTPException
import requests

router = APIRouter(prefix="/barcode", tags=["Barcode"])


@router.get("/{barcode}")
def get_product(barcode: str):

    url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"

    response = requests.get(
        url,
        headers={
            "User-Agent": "FoodBridgeAI/1.0"
        },
        timeout=10
    )

    if response.status_code != 200:
        raise HTTPException(404, "Unable to reach Open Food Facts")

    data = response.json()

    if data.get("status") == 0:
        raise HTTPException(404, "Product not found")

    product = data["product"]

    categories = product.get("categories_tags", [])
    category = ""

    if categories:
        category = categories[0].replace("en:", "").replace("-", " ").title()

    return {
        "barcode": barcode,
        "product_name": product.get("product_name", ""),
        "brand": product.get("brands", ""),
        "category": category,
        "image": product.get("image_front_url", "")
    }