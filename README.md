# Y
A chaining language

## Link indicators
(truthy links wrap to beginning of current section if fail)

 * C-link: move to the next section
 * D-link: pop N; if N is nonzero, move to the next section
 * F-link: pop N, if N is zero (falsey), move to the next section
 * J-link: pop N; move to the Nth section
 * M-link: pop N; move over N sections
 * P-link: pop N, M; if M is nonzero, move to the Nth section
 * Q-link: pop N, M; if M is nonzero, move over N sections
 * X-link: wrap back to beginning of section

## Operators

 * "..." write string characters
 * ' write next char
 * : duplicate
 * h head
 * d tail
 * ~ switch top two
 * ; duplicate entire stack
 * \+ add
 * / divide
 * \- minus
 * \* times
 * ^ exponent
 * 0-9 push number
 * c current links
 * n number of links
 * U begin scanning, ignore links, and record as string, until another U. (escapable); adds U to the front
 * V begin scanning until V met in same position
 * ! skip character (works in U)
 * L jump to last link
 * p print stack
 * r reverse stack
 * g print char
 * j print number
 * x end program
 * f fold
