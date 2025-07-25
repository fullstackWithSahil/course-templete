export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      apikeys: {
        Row: {
          created_at: string
          id: number
          key: string
          lastUsed: string
          name: string
          permissions: string[]
          status: string
          teacher: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          key?: string
          lastUsed?: string
          name?: string
          permissions: string[]
          status?: string
          teacher?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          key?: string
          lastUsed?: string
          name?: string
          permissions?: string[]
          status?: string
          teacher?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate: string | null
          course: number | null
          created_at: string
          id: number
          student: string | null
        }
        Insert: {
          certificate?: string | null
          course?: number | null
          created_at?: string
          id?: number
          student?: string | null
        }
        Update: {
          certificate?: string | null
          course?: number | null
          created_at?: string
          id?: number
          student?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_fkey"
            columns: ["course"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          comment: string | null
          commented_by: string | null
          created_at: string
          id: number
          liked_by: string[] | null
          profile: string | null
          reply: number | null
          sender: string | null
          video: number | null
        }
        Insert: {
          comment?: string | null
          commented_by?: string | null
          created_at?: string
          id?: number
          liked_by?: string[] | null
          profile?: string | null
          reply?: number | null
          sender?: string | null
          video?: number | null
        }
        Update: {
          comment?: string | null
          commented_by?: string | null
          created_at?: string
          id?: number
          liked_by?: string[] | null
          profile?: string | null
          reply?: number | null
          sender?: string | null
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
          chat: string | null
          created_at: string
          description: string | null
          id: number
          name: string | null
          price: number | null
          teacher: string | null
          thumbnail: string | null
        }
        Insert: {
          chat?: string | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          price?: number | null
          teacher?: string | null
          thumbnail?: string | null
        }
        Update: {
          chat?: string | null
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
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: number
          name: string | null
          note: string | null
          source: string | null
          teacher: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
          note?: string | null
          source?: string | null
          teacher?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
          note?: string | null
          source?: string | null
          teacher?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          course: number | null
          created_at: string
          email: string | null
          id: number
          name: string | null
          note: string | null
          student: string | null
          teacher: string | null
          watchedVideos: number[] | null
        }
        Insert: {
          course?: number | null
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
          note?: string | null
          student?: string | null
          teacher?: string | null
          watchedVideos?: number[] | null
        }
        Update: {
          course?: number | null
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
          note?: string | null
          student?: string | null
          teacher?: string | null
          watchedVideos?: number[] | null
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
      teachers: {
        Row: {
          accountName: string
          accountNumber: string
          brandName: string
          completed: boolean
          created_at: string
          curriculum: string
          email: string
          expectedStudents: string
          id: number
          location: string
          logo: string
          mobile: string
          name: string
          notificationContact: string
          notificationMethod: string
          routingNumber: string
          senderEmail: string | null
          teacher: string
        }
        Insert: {
          accountName: string
          accountNumber: string
          brandName: string
          completed?: boolean
          created_at?: string
          curriculum: string
          email: string
          expectedStudents: string
          id?: number
          location: string
          logo: string
          mobile: string
          name?: string
          notificationContact: string
          notificationMethod: string
          routingNumber: string
          senderEmail?: string | null
          teacher: string
        }
        Update: {
          accountName?: string
          accountNumber?: string
          brandName?: string
          completed?: boolean
          created_at?: string
          curriculum?: string
          email?: string
          expectedStudents?: string
          id?: number
          location?: string
          logo?: string
          mobile?: string
          name?: string
          notificationContact?: string
          notificationMethod?: string
          routingNumber?: string
          senderEmail?: string | null
          teacher?: string
        }
        Relationships: []
      }
      templetes: {
        Row: {
          body: string
          created_at: string
          id: number
          name: string
          teacher: string
          variables: string[]
        }
        Insert: {
          body: string
          created_at?: string
          id?: number
          name?: string
          teacher: string
          variables: string[]
        }
        Update: {
          body?: string
          created_at?: string
          id?: number
          name?: string
          teacher?: string
          variables?: string[]
        }
        Relationships: []
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
      delete_course_with_videos: {
        Args: { course_id: number }
        Returns: undefined
      }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
