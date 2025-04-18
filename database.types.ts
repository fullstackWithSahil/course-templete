export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          comment: string | null
          commented_by: string | null
          created_at: string
          id: number
          likes: number | null
          profile: string | null
          video: number | null
        }
        Insert: {
          comment?: string | null
          commented_by?: string | null
          created_at?: string
          id?: number
          likes?: number | null
          profile?: string | null
          video?: number | null
        }
        Update: {
          comment?: string | null
          commented_by?: string | null
          created_at?: string
          id?: number
          likes?: number | null
          profile?: string | null
          video?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_video_fkey"
            columns: ["video"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string | null
          price: number | null
          teacher: string | null
          thumbnail: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          price?: number | null
          teacher?: string | null
          thumbnail?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          price?: number | null
          teacher?: string | null
          thumbnail?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          course: number | null
          created_at: string
          firstname: string | null
          group: boolean
          id: number
          message: string | null
          profile: string | null
          sender: string | null
          to: string | null
        }
        Insert: {
          course?: number | null
          created_at?: string
          firstname?: string | null
          group?: boolean
          id?: number
          message?: string | null
          profile?: string | null
          sender?: string | null
          to?: string | null
        }
        Update: {
          course?: number | null
          created_at?: string
          firstname?: string | null
          group?: boolean
          id?: number
          message?: string | null
          profile?: string | null
          sender?: string | null
          to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_course_fkey"
            columns: ["course"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          course: number | null
          created_at: string
          email: string | null
          id: number
          note: string | null
          student: string | null
          teacher: string | null
        }
        Insert: {
          course?: number | null
          created_at?: string
          email?: string | null
          id?: number
          note?: string | null
          student?: string | null
          teacher?: string | null
        }
        Update: {
          course?: number | null
          created_at?: string
          email?: string | null
          id?: number
          note?: string | null
          student?: string | null
          teacher?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Students_course_fkey"
            columns: ["course"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          course: number | null
          created_at: string
          description: string | null
          id: number
          lesson: number | null
          module: string | null
          teacher: string | null
          thumbnail: string | null
          title: string | null
          url: string | null
        }
        Insert: {
          course?: number | null
          created_at?: string
          description?: string | null
          id?: number
          lesson?: number | null
          module?: string | null
          teacher?: string | null
          thumbnail?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          course?: number | null
          created_at?: string
          description?: string | null
          id?: number
          lesson?: number | null
          module?: string | null
          teacher?: string | null
          thumbnail?: string | null
          title?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_course_fkey"
            columns: ["course"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
