from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Section(BaseModel):
    title: str
    content: str
    image: Optional[str] = None
    imageStyle: Optional[str] = "cover"  # "contain", "cover", "original"
    order: int = 0

class PageBase(BaseModel):
    slug: str
    title: str
    subtitle: Optional[str] = ""
    heroImage: Optional[str] = None
    heroImageStyle: Optional[str] = "cover"  # "contain", "cover", "original"
    sections: List[Section] = []
    metaDescription: Optional[str] = ""
    isPublished: bool = True

class PageCreate(PageBase):
    pass

class PageUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    heroImage: Optional[str] = None
    heroImageStyle: Optional[str] = None
    sections: Optional[List[Section]] = None
    metaDescription: Optional[str] = None
    isPublished: Optional[bool] = None

class PageInDB(PageBase):
    id: str = Field(alias="_id")
    createdAt: datetime
    updatedAt: datetime

    class Config:
        populate_by_name = True
