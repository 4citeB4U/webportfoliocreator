-- Drop trigger first
DROP TRIGGER IF EXISTS update_portfolios_updated_at ON portfolios;

-- Drop trigger function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_portfolios_user_id;
DROP INDEX IF EXISTS idx_portfolios_is_published;
DROP INDEX IF EXISTS idx_portfolio_components_portfolio_id;
DROP INDEX IF EXISTS idx_portfolios_updated_at;

-- Drop tables (order matters due to foreign key constraints)
DROP TABLE IF EXISTS portfolio_components;
DROP TABLE IF EXISTS portfolios;
