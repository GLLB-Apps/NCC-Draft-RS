/*
# Rögleskogen - Kärnschema
*/

-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('superadmin', 'redaktor', 'skribent')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Helper functions (must come after user_roles table)
CREATE OR REPLACE FUNCTION public.user_has_role(role_name text)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = role_name);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('superadmin', 'redaktor', 'skribent'));
$$;

-- Enable RLS on profiles and user_roles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_admin_select_all" ON public.profiles;
CREATE POLICY "profiles_admin_select_all" ON public.profiles FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "user_roles_admin_all" ON public.user_roles;
CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "user_roles_superadmin_insert" ON public.user_roles;
CREATE POLICY "user_roles_superadmin_insert" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.user_has_role('superadmin'));
DROP POLICY IF EXISTS "user_roles_superadmin_update" ON public.user_roles;
CREATE POLICY "user_roles_superadmin_update" ON public.user_roles FOR UPDATE TO authenticated USING (public.user_has_role('superadmin')) WITH CHECK (public.user_has_role('superadmin'));
DROP POLICY IF EXISTS "user_roles_superadmin_delete" ON public.user_roles;
CREATE POLICY "user_roles_superadmin_delete" ON public.user_roles FOR DELETE TO authenticated USING (public.user_has_role('superadmin'));
DROP POLICY IF EXISTS "user_roles_read_own" ON public.user_roles;
CREATE POLICY "user_roles_read_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'Rögleskogen',
  site_subtitle text NOT NULL DEFAULT 'Information om den planerade bergtäkten mellan Södra Sandby och Dalby',
  logo_url text, favicon_url text,
  petition_url text DEFAULT 'https://www.skrivunder.com/',
  default_share_image text, contact_email text, contact_phone text,
  social_links jsonb DEFAULT '{}', footer_text text, privacy_text text, cookie_text text,
  status_message text, status_phase text, next_important_date date, signature_count integer DEFAULT 0,
  hero_title text DEFAULT 'Ett nytt stenbrott planeras i Rögleskogen',
  hero_intro text DEFAULT 'NCC har informerat om planer på att ansöka om tillstånd för en ny bergtäkt mellan Södra Sandby och Dalby. Här samlas information, dokument, bilder, vittnesmål och frågor om hur området och närområdet kan påverkas.',
  hero_image text,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "site_settings_public_read" ON public.site_settings;
CREATE POLICY "site_settings_public_read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "site_settings_admin_write" ON public.site_settings;
CREATE POLICY "site_settings_admin_write" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- content_categories
CREATE TABLE IF NOT EXISTS public.content_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, slug text NOT NULL UNIQUE, description text, icon text,
  sort_order integer DEFAULT 0, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "categories_public_read" ON public.content_categories;
CREATE POLICY "categories_public_read" ON public.content_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "categories_admin_write" ON public.content_categories;
CREATE POLICY "categories_admin_write" ON public.content_categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- topics
CREATE TABLE IF NOT EXISTS public.topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, slug text NOT NULL UNIQUE, intro text, content jsonb DEFAULT '[]',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  featured_image text, sort_order integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id), updated_by uuid REFERENCES auth.users(id),
  published_at timestamptz, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "topics_public_read" ON public.topics;
CREATE POLICY "topics_public_read" ON public.topics FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "topics_admin_read" ON public.topics;
CREATE POLICY "topics_admin_read" ON public.topics FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "topics_admin_insert" ON public.topics;
CREATE POLICY "topics_admin_insert" ON public.topics FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "topics_admin_update" ON public.topics;
CREATE POLICY "topics_admin_update" ON public.topics FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "topics_admin_delete" ON public.topics;
CREATE POLICY "topics_admin_delete" ON public.topics FOR DELETE TO authenticated USING (public.is_admin());

-- posts
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, slug text NOT NULL UNIQUE, excerpt text, content jsonb DEFAULT '[]',
  featured_image text, image_caption text, author text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  is_pinned boolean DEFAULT false, seo_title text, seo_description text,
  published_at timestamptz, created_by uuid REFERENCES auth.users(id), updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "posts_public_read" ON public.posts;
CREATE POLICY "posts_public_read" ON public.posts FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "posts_admin_read" ON public.posts;
CREATE POLICY "posts_admin_read" ON public.posts FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "posts_admin_insert" ON public.posts;
CREATE POLICY "posts_admin_insert" ON public.posts FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "posts_admin_update" ON public.posts;
CREATE POLICY "posts_admin_update" ON public.posts FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "posts_admin_delete" ON public.posts;
CREATE POLICY "posts_admin_delete" ON public.posts FOR DELETE TO authenticated USING (public.is_admin());

-- testimonies
CREATE TABLE IF NOT EXISTS public.testimonies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text, story text NOT NULL, author_name text, is_anonymous boolean DEFAULT false,
  email text, location text, area_usage text, featured_image text,
  map_lat double precision, map_lng double precision,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
  consent_publish boolean DEFAULT false, consent_contact boolean DEFAULT false,
  internal_note text, published_at timestamptz,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.testimonies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "testimonies_public_read" ON public.testimonies;
CREATE POLICY "testimonies_public_read" ON public.testimonies FOR SELECT TO anon, authenticated USING (status = 'approved');
DROP POLICY IF EXISTS "testimonies_admin_read" ON public.testimonies;
CREATE POLICY "testimonies_admin_read" ON public.testimonies FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "testimonies_public_insert" ON public.testimonies;
CREATE POLICY "testimonies_public_insert" ON public.testimonies FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "testimonies_admin_update" ON public.testimonies;
CREATE POLICY "testimonies_admin_update" ON public.testimonies FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "testimonies_admin_delete" ON public.testimonies;
CREATE POLICY "testimonies_admin_delete" ON public.testimonies FOR DELETE TO authenticated USING (public.is_admin());

-- documents
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, description text, file_url text, external_url text,
  document_date date, sender text,
  sender_type text CHECK (sender_type IN ('ncc', 'lund_kommun', 'authority', 'media', 'initiative', 'private')),
  file_type text, source text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz, created_by uuid REFERENCES auth.users(id), updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "documents_public_read" ON public.documents;
CREATE POLICY "documents_public_read" ON public.documents FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "documents_admin_read" ON public.documents;
CREATE POLICY "documents_admin_read" ON public.documents FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "documents_admin_insert" ON public.documents;
CREATE POLICY "documents_admin_insert" ON public.documents FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "documents_admin_update" ON public.documents;
CREATE POLICY "documents_admin_update" ON public.documents FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "documents_admin_delete" ON public.documents;
CREATE POLICY "documents_admin_delete" ON public.documents FOR DELETE TO authenticated USING (public.is_admin());

-- media_items
CREATE TABLE IF NOT EXISTS public.media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, description text, alt_text text, photographer text,
  media_date date, location text,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video', 'map', 'graphic', 'press_image')),
  file_url text, video_url text, rights_info text, is_press_allowed boolean DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz, created_by uuid REFERENCES auth.users(id), updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "media_public_read" ON public.media_items;
CREATE POLICY "media_public_read" ON public.media_items FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "media_admin_read" ON public.media_items;
CREATE POLICY "media_admin_read" ON public.media_items FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "media_admin_insert" ON public.media_items;
CREATE POLICY "media_admin_insert" ON public.media_items FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "media_admin_update" ON public.media_items;
CREATE POLICY "media_admin_update" ON public.media_items FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "media_admin_delete" ON public.media_items;
CREATE POLICY "media_admin_delete" ON public.media_items FOR DELETE TO authenticated USING (public.is_admin());

-- map_locations
CREATE TABLE IF NOT EXISTS public.map_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, description text, lat double precision NOT NULL, lng double precision NOT NULL,
  point_type text NOT NULL CHECK (point_type IN ('work_area', 'quarry_area', 'property_border', 'transport_route', 'residence_distance', 'nature_value', 'walking_trail', 'observation_point', 'photo_point', 'testimony_point')),
  image_url text, source text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz, created_by uuid REFERENCES auth.users(id), updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.map_locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "map_public_read" ON public.map_locations;
CREATE POLICY "map_public_read" ON public.map_locations FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "map_admin_read" ON public.map_locations;
CREATE POLICY "map_admin_read" ON public.map_locations FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "map_admin_insert" ON public.map_locations;
CREATE POLICY "map_admin_insert" ON public.map_locations FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "map_admin_update" ON public.map_locations;
CREATE POLICY "map_admin_update" ON public.map_locations FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "map_admin_delete" ON public.map_locations;
CREATE POLICY "map_admin_delete" ON public.map_locations FOR DELETE TO authenticated USING (public.is_admin());

-- timeline_events
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_date date NOT NULL, title text NOT NULL, description text, event_type text,
  link_url text, related_document_id uuid REFERENCES public.documents(id), image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz, sort_order integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id), updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "timeline_public_read" ON public.timeline_events;
CREATE POLICY "timeline_public_read" ON public.timeline_events FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "timeline_admin_read" ON public.timeline_events;
CREATE POLICY "timeline_admin_read" ON public.timeline_events FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "timeline_admin_insert" ON public.timeline_events;
CREATE POLICY "timeline_admin_insert" ON public.timeline_events FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "timeline_admin_update" ON public.timeline_events;
CREATE POLICY "timeline_admin_update" ON public.timeline_events FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "timeline_admin_delete" ON public.timeline_events;
CREATE POLICY "timeline_admin_delete" ON public.timeline_events FOR DELETE TO authenticated USING (public.is_admin());

-- faq_categories
CREATE TABLE IF NOT EXISTS public.faq_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, slug text NOT NULL UNIQUE, sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.faq_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "faq_cat_public_read" ON public.faq_categories;
CREATE POLICY "faq_cat_public_read" ON public.faq_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "faq_cat_admin_write" ON public.faq_categories;
CREATE POLICY "faq_cat_admin_write" ON public.faq_categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- faq_items
CREATE TABLE IF NOT EXISTS public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL, answer text NOT NULL,
  category_id uuid REFERENCES public.faq_categories(id) ON DELETE SET NULL,
  sort_order integer DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz, created_by uuid REFERENCES auth.users(id), updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "faq_public_read" ON public.faq_items;
CREATE POLICY "faq_public_read" ON public.faq_items FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "faq_admin_read" ON public.faq_items;
CREATE POLICY "faq_admin_read" ON public.faq_items FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "faq_admin_insert" ON public.faq_items;
CREATE POLICY "faq_admin_insert" ON public.faq_items FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "faq_admin_update" ON public.faq_items;
CREATE POLICY "faq_admin_update" ON public.faq_items FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "faq_admin_delete" ON public.faq_items;
CREATE POLICY "faq_admin_delete" ON public.faq_items FOR DELETE TO authenticated USING (public.is_admin());

-- contacts
CREATE TABLE IF NOT EXISTS public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, role text, email text, phone text,
  is_public boolean DEFAULT true, sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contacts_public_read" ON public.contacts;
CREATE POLICY "contacts_public_read" ON public.contacts FOR SELECT TO anon, authenticated USING (is_public = true);
DROP POLICY IF EXISTS "contacts_admin_read" ON public.contacts;
CREATE POLICY "contacts_admin_read" ON public.contacts FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "contacts_admin_write" ON public.contacts;
CREATE POLICY "contacts_admin_write" ON public.contacts FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- contact_messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, email text NOT NULL, subject text, message text NOT NULL,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'handled', 'archived')),
  internal_note text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contact_messages_public_insert" ON public.contact_messages;
CREATE POLICY "contact_messages_public_insert" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "contact_messages_admin_read" ON public.contact_messages;
CREATE POLICY "contact_messages_admin_read" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "contact_messages_admin_update" ON public.contact_messages;
CREATE POLICY "contact_messages_admin_update" ON public.contact_messages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "contact_messages_admin_delete" ON public.contact_messages;
CREATE POLICY "contact_messages_admin_delete" ON public.contact_messages FOR DELETE TO authenticated USING (public.is_admin());

-- audit_log
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id), action text NOT NULL,
  entity_type text, entity_id uuid, details jsonb, created_at timestamptz DEFAULT now()
);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "audit_log_admin_read" ON public.audit_log;
CREATE POLICY "audit_log_admin_read" ON public.audit_log FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "audit_log_admin_insert" ON public.audit_log;
CREATE POLICY "audit_log_admin_insert" ON public.audit_log FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- content_category_relations
CREATE TABLE IF NOT EXISTS public.content_category_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('topic', 'post', 'document', 'media', 'testimony', 'timeline')),
  content_id uuid NOT NULL, category_id uuid NOT NULL REFERENCES public.content_categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(), UNIQUE(content_type, content_id, category_id)
);
ALTER TABLE public.content_category_relations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "category_relations_public_read" ON public.content_category_relations;
CREATE POLICY "category_relations_public_read" ON public.content_category_relations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "category_relations_admin_write" ON public.content_category_relations;
CREATE POLICY "category_relations_admin_write" ON public.content_category_relations FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- navigation_items
CREATE TABLE IF NOT EXISTS public.navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL, url text NOT NULL, sort_order integer DEFAULT 0, is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "nav_public_read" ON public.navigation_items;
CREATE POLICY "nav_public_read" ON public.navigation_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "nav_admin_write" ON public.navigation_items;
CREATE POLICY "nav_admin_write" ON public.navigation_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' LOOP
    BEGIN
      EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
      EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at()', t);
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END LOOP;
END $$;
