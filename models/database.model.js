import mysql from "mysql2/promise";

class DatabaseModel{
    static pool;
    activeTransaction;

    constructor(transaction_connection = null){
        if(!DatabaseModel.pool){
            const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_PORT } = process.env;

            DatabaseModel.pool = mysql.createPool({
                host: DATABASE_HOST,
                user: DATABASE_USER,
                password: DATABASE_PASSWORD,
                database: DATABASE_NAME,
                port: DATABASE_PORT,
            });
        }

        this.activeTransaction = transaction_connection;
    }

    getConnection = async () => {
        if(this.activeTransaction){
            return this.activeTransaction;
        }
        else{
            return await DatabaseModel.pool.getConnection();
        }
    }

    executeQuery = async (query) => {
        const connection = await this.getConnection();

        try{
            const [rows] = await connection.query(query);
            return rows;
        }
        catch(error){
            throw error;
        }
        finally{
            if(!this.activeTransaction){
                connection.release();
            }
        }
    }

    startTransaction = async() => {
        const connection = await this.getConnection();

        try{
            await connection.beginTransaction();
            return connection;
        }
        catch(error){
            await this.cancelTransaction(connection);
            throw error;
        }
    }

    setActiveTransaction = (transaction_connection) => {
        this.activeTransaction = transaction_connection || null;
    }

    commitTransaction = async (connection) => {
        try{
            await connection.commit();
            this.setActiveTransaction(null);
            connection.release();
        }
        catch(commit_error){
            await this.cancelTransaction(connection);
            throw commit_error;
        }
    }

    cancelTransaction = async (connection) => {
        try{
            await connection.rollback();
        }
        catch(rollback_error){
            throw rollback_error;
        }
        finally{
            this.setActiveTransaction(null);
            connection.release();
        }
    }
}

export default DatabaseModel;