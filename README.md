Zeta Database with ORM
A lightweight, file-based database system with built-in Object-Relational Mapping (ORM) capabilities, implemented entirely in JavaScript. This project includes:

Persistent Database Engine: Stores data in JSON files with CRUD operations

Database Server: Runs on a separate port (5656) with REST API interface

ORM Layer: Provides model definitions with schema validation

Express Integration: Ready-to-use with Node.js/Express applications

Key Features:

Simple schema definitions with field types

Automatic table creation

Promise-based asynchronous operations

Separation of database and application layers

No external dependencies (except Express for the server)

Perfect for small to medium projects needing a simple but flexible data persistence layer without heavy database servers. The ORM provides a clean abstraction while maintaining direct access to the underlying data when needed.
