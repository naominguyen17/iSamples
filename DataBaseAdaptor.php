 <?php
	//
	// Original Author: Rick Mercer and Hassanain Jamal
	// Modified: Jingyu Shi
	class DatabaseAdaptor {

		private $DB;
		
		public function __construct() {
			$db = 'mysql:dbname=movie;host=localhost';
			$user = 'root';
			$password = '';
			
			try {
				$this->DB = new PDO ( $db, $user, $password );
				$this->DB->setAttribute ( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
			} catch ( PDOException $e ) {
				echo ('Error establishing Connection');
				exit ();
			}
		}
		public function register($username, $password) {
			$hash = password_hash ( $password, PASSWORD_DEFAULT );
			try {
				$sth = $this->DB->prepare ( "INSERT INTO users (username, hash) VALUES ( :username, :hash);" );
				$sth->bindParam ( ':username', $username );
				$sth->bindParam ( ':hash', $hash );
				$sth->execute ();
				header ( "Location: index.html" );
			}catch(PDOException $e){
				 header ( "Location: register.php?mode=invalid" );
				return;
			}

		}
		
		public function registerVerified($username) {
		}

		public function verified($username, $password) {
			$stmt = $this->DB->prepare ( 'SELECT hash FROM users WHERE username = :username' );
			$stmt->bindParam ( ':username', $username );
			$stmt->execute ();
			$user = $stmt->fetch ();
			
			// Hashing the password with its hash as the salt returns the same hash
			if (password_verify ( $password, $user ['hash'] ))
				return TRUE;
			else
				return FALSE;
			
			$currentRecord = $stmt->fetch ();
			return $currentRecord ['flagged'] === 't';
		}
	} // end class DatabaseAdaptor
	
	$myDatabaseFunctions = new DatabaseAdaptor ();
	

	?>