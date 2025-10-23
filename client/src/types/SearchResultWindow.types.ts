type User = {
  id: string
  username: string
  imageUrl: string
  
}

export interface SearchResultWindowPropsType {
  users: User[]
}