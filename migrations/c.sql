  CREATE TABLE IF NOT EXISTS permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS roles(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  INSERT INTO roles (name)
  VALUES
  ('owner'),
  ('admin'),
  ('editor'),
  ('contributor'),
  ('viewer')
  ON CONFLICT (name)
  DO NOTHING;

  CREATE FUNCTION renew_update_on()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_on = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';

  CREATE TRIGGER renew_permissions_updated_on
    BEFORE UPDATE
    ON
      permissions
    FOR EACH ROW
    EXECUTE PROCEDURE renew_update_on();

  CREATE TRIGGER renew_roles_updated_on
    BEFORE UPDATE 
    ON 
      roles
    FOR EACH ROW
    EXECUTE PROCEDURE renew_update_on();

  CREATE TABLE IF NOT EXISTS granted_permissions(
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions (id)
  );

  CREATE TABLE IF NOT EXISTS external_providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_name VARCHAR(50) UNIQUE NOT NULL,
    created_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TRIGGER renew_external_providers_updated_on
    BEFORE UPDATE 
    ON 
      external_providers
    FOR EACH ROW
    EXECUTE PROCEDURE renew_update_on();

  CREATE TABLE IF NOT EXISTS user_account(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('m','f')),
    birth_date DATE NOT NULL CHECK (birth_date > '1900-01-01'),
    created_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    role_id UUID,
    CONSTRAINT role_id FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE
  );
      
  CREATE TRIGGER renew_user_account_updated_on
    BEFORE UPDATE 
    ON 
      user_account
    FOR EACH ROW
    EXECUTE PROCEDURE renew_update_on();

  CREATE TABLE IF NOT EXISTS user_external_authentication (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_token VARCHAR(200) NOT NULL UNIQUE,
    user_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    created_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE,
    CONSTRAINT provider_id FOREIGN KEY (provider_id) REFERENCES external_providers(id) ON DELETE CASCADE
  );

  CREATE TRIGGER renew_user_external_authentication_updated_on
    BEFORE UPDATE 
    ON 
    user_external_authentication
    FOR EACH ROW
    EXECUTE PROCEDURE renew_update_on();

  CREATE TABLE IF NOT EXISTS email_validation_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    created_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TRIGGER renew_email_validation_status_updated_on
    BEFORE UPDATE 
    ON 
    email_validation_status
    FOR EACH ROW
    EXECUTE PROCEDURE renew_update_on();

  CREATE TABLE IF NOT EXISTS user_login_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    password_hash VARCHAR(250) NOT NULL UNIQUE,
    password_salt VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    confirmation_token VARCHAR(100),
    confirmation_token_created_on TIMESTAMPTZ,
    email_validation_status_id UUID NOT NULL,
    password_recovery_token VARCHAR(100),
    password_recovery_token_created_on TIMESTAMPTZ,
    created_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE,
    CONSTRAINT email_validation_status_id FOREIGN KEY (email_validation_status_id) REFERENCES email_validation_status(id) ON DELETE CASCADE
  );

  CREATE TRIGGER renew_user_login_data_updated_on
    BEFORE UPDATE 
    ON 
    user_login_data
    FOR EACH ROW
    EXECUTE PROCEDURE renew_update_on();