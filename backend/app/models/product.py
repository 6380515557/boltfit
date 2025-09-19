from pydantic import BaseModel, Field, validator
from typing import List, Optional, Union
from datetime import datetime
from fastapi import UploadFile

class ProductSize(BaseModel):
    size: str = Field(..., description="Size (XS, S, M, L, XL, XXL)")
    stock: int = Field(ge=0, description="Stock quantity for this size")

class ProductColor(BaseModel):
    name: str = Field(..., description="Color name")
    hex_code: str = Field(..., description="Hex color code")

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Product name")
    description: str = Field(..., min_length=1, max_length=2000, description="Product description")
    price: float = Field(gt=0, description="Product price")
    original_price: Optional[float] = Field(None, gt=0, description="Original price (before discount)")
    category: str = Field(..., description="Product category (Shirts, Pants, T-Shirts, Trending)")
    images: List[str] = Field(default_factory=list, description="List of image URLs")
    sizes: List[ProductSize] = Field(default_factory=list, description="Available sizes and stock")
    colors: List[ProductColor] = Field(default_factory=list, description="Available colors")
    material: Optional[str] = Field(None, description="Product material")
    brand: str = Field(default="BOLT FIT", description="Product brand")
    is_featured: bool = Field(default=False, description="Whether product is featured")
    is_active: bool = Field(default=True, description="Whether product is active")

# New model for handling form data from frontend
class ProductCreateForm(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=2000)
    price: float = Field(gt=0)
    original_price: Optional[float] = Field(None, gt=0)
    category: str
    material: Optional[str] = None
    brand: str = Field(default="BOLT FIT")
    sizes: str = Field(default="", description="Comma-separated sizes (S,M,L,XL)")
    colors: str = Field(default="", description="Comma-separated colors (Red,Blue,Green)")
    is_featured: bool = Field(default=False)
    is_active: bool = Field(default=True)

    def to_product_create(self, image_urls: List[str] = None) -> "ProductCreate":
        """Convert form data to ProductCreate with proper structure"""
        
        # Parse sizes from comma-separated string
        size_list = []
        if self.sizes.strip():
            for size in self.sizes.split(','):
                size = size.strip()
                if size:
                    size_list.append(ProductSize(size=size, stock=0))  # Default stock to 0
        
        # Parse colors from comma-separated string  
        color_list = []
        if self.colors.strip():
            color_names = [c.strip() for c in self.colors.split(',') if c.strip()]
            # Generate basic hex codes for colors (you can enhance this)
            color_hex_map = {
                'red': '#FF0000', 'blue': '#0000FF', 'green': '#008000',
                'black': '#000000', 'white': '#FFFFFF', 'gray': '#808080',
                'yellow': '#FFFF00', 'orange': '#FFA500', 'purple': '#800080',
                'pink': '#FFC0CB', 'brown': '#A52A2A', 'navy': '#000080'
            }
            
            for color_name in color_names:
                hex_code = color_hex_map.get(color_name.lower(), '#000000')
                color_list.append(ProductColor(name=color_name, hex_code=hex_code))

        return ProductCreate(
            name=self.name,
            description=self.description,
            price=self.price,
            original_price=self.original_price,
            category=self.category,
            material=self.material,
            brand=self.brand,
            images=image_urls or [],
            sizes=size_list,
            colors=color_list,
            is_featured=self.is_featured,
            is_active=self.is_active
        )

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=1, max_length=2000)
    price: Optional[float] = Field(None, gt=0)
    original_price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = None
    images: Optional[List[str]] = None
    sizes: Optional[List[ProductSize]] = None
    colors: Optional[List[ProductColor]] = None
    material: Optional[str] = None
    brand: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

class ProductUpdateForm(BaseModel):
    """Form-friendly update model"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=1, max_length=2000)
    price: Optional[float] = Field(None, gt=0)
    original_price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = None
    material: Optional[str] = None
    brand: Optional[str] = None
    sizes: Optional[str] = Field(None, description="Comma-separated sizes")
    colors: Optional[str] = Field(None, description="Comma-separated colors")
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

    def to_product_update(self, image_urls: List[str] = None) -> ProductUpdate:
        """Convert form data to ProductUpdate"""
        update_data = {}
        
        # Basic fields
        for field in ['name', 'description', 'price', 'original_price', 'category', 'material', 'brand', 'is_featured', 'is_active']:
            value = getattr(self, field)
            if value is not None:
                update_data[field] = value
        
        # Handle images
        if image_urls is not None:
            update_data['images'] = image_urls
            
        # Handle sizes
        if self.sizes is not None:
            size_list = []
            if self.sizes.strip():
                for size in self.sizes.split(','):
                    size = size.strip()
                    if size:
                        size_list.append(ProductSize(size=size, stock=0))
            update_data['sizes'] = size_list
            
        # Handle colors
        if self.colors is not None:
            color_list = []
            if self.colors.strip():
                color_names = [c.strip() for c in self.colors.split(',') if c.strip()]
                color_hex_map = {
                    'red': '#FF0000', 'blue': '#0000FF', 'green': '#008000',
                    'black': '#000000', 'white': '#FFFFFF', 'gray': '#808080',
                    'yellow': '#FFFF00', 'orange': '#FFA500', 'purple': '#800080',
                    'pink': '#FFC0CB', 'brown': '#A52A2A', 'navy': '#000080'
                }
                
                for color_name in color_names:
                    hex_code = color_hex_map.get(color_name.lower(), '#000000')
                    color_list.append(ProductColor(name=color_name, hex_code=hex_code))
            update_data['colors'] = color_list
            
        return ProductUpdate(**update_data)

class ProductResponse(ProductBase):
    id: str = Field(..., description="Product ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    
    @property
    def discount_percentage(self) -> float:
        """Calculate discount percentage"""
        if self.original_price and self.original_price > self.price:
            return round(((self.original_price - self.price) / self.original_price) * 100, 2)
        return 0.0
    
    @property
    def size_names(self) -> List[str]:
        """Get just the size names as a list"""
        return [size.size for size in self.sizes]
    
    @property
    def color_names(self) -> List[str]:
        """Get just the color names as a list"""
        return [color.name for color in self.colors]

class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
