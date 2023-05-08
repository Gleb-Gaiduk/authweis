import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
  CREATE TABLE IF NOT EXISTS permissions (
    permission_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS roles(
    role_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id)
  );
  
  CREATE TABLE IF NOT EXISTS external_providers (
    provider_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    account_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('m','f')),
    birth_date DATE NOT NULL CHECK (birth_date > '1900-01-01'),
    created_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    role_id UUID,
    FOREIGN KEY(role_id) REFERENCES roles(role_id) ON DELETE CASCADE
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
    FOREIGN KEY (user_id) REFERENCES user_account(account_id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES external_providers(provider_id) ON DELETE CASCADE
  );
  
  CREATE TRIGGER renew_user_external_authentication_updated_on
    BEFORE UPDATE 
    ON 
    user_external_authentication
    FOR EACH ROW
    EXECUTE PROCEDURE renew_update_on();
  
  CREATE TABLE IF NOT EXISTS email_validation_status (
    status_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    FOREIGN KEY (user_id) REFERENCES user_account(account_id) ON DELETE CASCADE,
    FOREIGN KEY (email_validation_status_id) REFERENCES email_validation_status(status_id) ON DELETE CASCADE
  );
  
  CREATE TRIGGER renew_user_login_data_updated_on
    BEFORE UPDATE 
    ON 
    user_login_data
    FOR EACH ROW
    EXECUTE PROCEDURE renew_update_on();
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
  DROP TABLE IF EXISTS granted_permissions;
  DROP TABLE IF EXISTS user_login_data;
  DROP TABLE IF EXISTS user_external_authentication;
  DROP TABLE IF EXISTS user_account;
  DROP TABLE IF EXISTS roles;
  DROP TABLE IF EXISTS permissions;
  DROP TABLE IF EXISTS external_providers;
  DROP TABLE IF EXISTS email_validation_status;
  
  DROP TRIGGER IF EXISTS renew_permissions_updated_on ON permissions;
  DROP TRIGGER IF EXISTS renew_roles_updated_on ON roles;
  DROP TRIGGER IF EXISTS renew_external_providers_updated_on ON external_providers;
  DROP TRIGGER IF EXISTS renew_user_account_updated_on ON user_account;
  DROP TRIGGER IF EXISTS renew_user_external_authentication_updated_on ON user_external_authentication;
  DROP TRIGGER IF EXISTS renew_email_validation_status_updated_on ON email_validation_status;
  DROP TRIGGER IF EXISTS renew_user_login_data_updated_on ON user_login_data;
  
  DROP FUNCTION IF EXISTS renew_update_on;
  `);
}
