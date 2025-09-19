from fastapi import APIRouter, HTTPException, Depends, Query, status, Form
from typing import List, Optional
from app.models.product import (
    ProductCreate, ProductUpdate, ProductResponse, ProductListResponse,
    ProductCreateForm, ProductUpdateForm
)
from app.services.firebase_service import firebase_service
from app.auth.google_auth import get_current_admin
from datetime import datetime
import math
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/products", tags=["Products"])

# PUBLIC ENDPOINTS (No authentication required)
@router.get("/", response_model=ProductListResponse)
async def get_products(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(10, ge=1, le=100, description="Items per page"),
    category: Optional[str] = Query(None, description="Filter by category"),
    is_active: bool = Query(True, description="Filter by active status"),
    is_featured: Optional[bool] = Query(None, description="Filter by featured status"),
    search: Optional[str] = Query(None, description="Search in name and description")
):
    """Get all products - PUBLIC ACCESS for frontend"""
    try:
        all_products = firebase_service.get_all_documents("products")
        # Apply filters
        filtered_products = []
        for product in all_products:
            if product.get("is_active") != is_active:
                continue
            if category and product.get("category") != category:
                continue
            if is_featured is not None and product.get("is_featured") != is_featured:
                continue
            
            # Search filter
            if search:
                search_term = search.lower()
                name = product.get("name", "").lower()
                description = product.get("description", "").lower()
                if search_term not in name and search_term not in description:
                    continue
            
            filtered_products.append(product)

        # Sort by created_at (newest first)
        filtered_products.sort(
            key=lambda x: x.get("created_at", datetime.now()),
            reverse=True
        )

        # Pagination
        total = len(filtered_products)
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_products = filtered_products[start_idx:end_idx]

        products = [ProductResponse(**product) for product in paginated_products]

        return ProductListResponse(
            products=products,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=math.ceil(total / per_page)
        )

    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching products"
        )

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    """Get a single product by ID - PUBLIC ACCESS"""
    try:
        product = firebase_service.get_document("products", product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )

        return ProductResponse(**product)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching product"
        )

# ✅ SIMPLIFIED ADMIN ENDPOINTS - No file upload, just metadata
@router.post("/", response_model=ProductResponse)
async def create_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    original_price: Optional[float] = Form(None),
    material: Optional[str] = Form(None),
    brand: str = Form("BOLT FIT"),
    sizes: str = Form(""),
    colors: str = Form(""),
    is_featured: bool = Form(False),
    is_active: bool = Form(True),
    image_urls: str = Form("[]"),  # ✅ JSON string of Firebase Storage URLs
    current_admin = Depends(get_current_admin)
):
    """Create a new product with Firebase image URLs - ADMIN ONLY"""
    try:
        import json
        # Parse image URLs from JSON string
        try:
            images_list = json.loads(image_urls)
        except:
            images_list = []

        # Create form data model
        form_data = ProductCreateForm(
            name=name,
            description=description,
            price=price,
            original_price=original_price,
            category=category,
            material=material,
            brand=brand,
            sizes=sizes,
            colors=colors,
            is_featured=is_featured,
            is_active=is_active
        )

        # Convert to ProductCreate
        product_create = form_data.to_product_create(images_list)

        # Prepare product data for Firebase
        product_dict = product_create.model_dump()
        product_dict["created_at"] = datetime.now()
        product_dict["updated_at"] = datetime.now()
        product_dict["created_by"] = current_admin["email"]

        # Add product to Firestore
        product_id = firebase_service.add_document("products", product_dict)
        logger.info(f"Product created by admin {current_admin['email']}: {product_id}")

        # Return created product
        created_product = firebase_service.get_document("products", product_id)
        return ProductResponse(**created_product)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating product"
        )

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    original_price: Optional[float] = Form(None),
    category: Optional[str] = Form(None),
    material: Optional[str] = Form(None),
    brand: Optional[str] = Form(None),
    sizes: Optional[str] = Form(None),
    colors: Optional[str] = Form(None),
    is_featured: Optional[bool] = Form(None),
    is_active: Optional[bool] = Form(None),
    image_urls: Optional[str] = Form(None),  # ✅ JSON string of Firebase URLs
    current_admin = Depends(get_current_admin)
):
    """Update a product with Firebase image URLs - ADMIN ONLY"""
    try:
        # Check if product exists
        existing_product = firebase_service.get_document("products", product_id)
        if not existing_product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )

        # Parse image URLs if provided
        images_list = None
        if image_urls:
            import json
            try:
                images_list = json.loads(image_urls)
            except:
                images_list = None

        # Create form data model
        form_data = ProductUpdateForm(
            name=name,
            description=description,
            price=price,
            original_price=original_price,
            category=category,
            material=material,
            brand=brand,
            sizes=sizes,
            colors=colors,
            is_featured=is_featured,
            is_active=is_active
        )

        # Convert to ProductUpdate
        product_update = form_data.to_product_update(images_list)

        # Prepare update data
        update_data = {k: v for k, v in product_update.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.now()
        update_data["updated_by"] = current_admin["email"]

        # Update product
        firebase_service.update_document("products", product_id, update_data)
        logger.info(f"Product updated by admin {current_admin['email']}: {product_id}")

        # Return updated product
        updated_product = firebase_service.get_document("products", product_id)
        return ProductResponse(**updated_product)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product {product_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating product"
        )

@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    current_admin = Depends(get_current_admin)
):
    """Delete a product - ADMIN ONLY"""
    try:
        # Check if product exists
        existing_product = firebase_service.get_document("products", product_id)
        if not existing_product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )

        # ✅ Note: Images remain in Firebase Storage
        # You can optionally delete them from Firebase Storage using Firebase Admin SDK
        
        # Delete product from Firebase
        firebase_service.delete_document("products", product_id)
        logger.info(f"Product deleted by admin {current_admin['email']}: {product_id}")

        return {
            "message": f"Product {product_id} deleted successfully",
            "deleted_by": current_admin["email"],
            "deleted_at": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting product {product_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting product"
        )

# Utility endpoint to get categories
@router.get("/meta/categories")
async def get_categories():
    """Get available product categories"""
    return {
        "categories": ["Shirts", "T-Shirts", "Pants", "Trending"]
    }
