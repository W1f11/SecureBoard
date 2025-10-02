<?php
print_r(openssl_get_cert_locations());
echo "openssl.cafile: " . ini_get('openssl.cafile') . "\n";
echo "curl.cainfo: " . ini_get('curl.cainfo') . "\n";
?>