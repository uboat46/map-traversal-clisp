(let ((distance-info (make-hash-table :size 20))
      (path-predecessor-info (make-hash-table :size 20)) )
  (defun set-distances (x y)
    (setf (gethash x distance-info) y) )
  (defun get-distances (x)
    (gethash x distance-info) )
  (defun set-predecessor (x y)
    (setf (gethash x path-predecessor-info) y) )
  (defun get-predecessor (x)
    (gethash x path-predecessor-info) )
  )

(set-distances 'brest '((rennes . 244)))
(set-distances 'rennes '((caen . 176)(paris . 348)(brest . 244)(nantes . 107)))

(set-distances 'caen '((calais . 120)(paris . 241)(rennes . 176)))
(set-distances 'calais '((nancy . 534)(paris . 297)(caen . 120)))

(set-distances 'nancy '((strasbourg . 145)(dijon . 201)(paris . 372)(calais . 534)))
(set-distances 'strasbourg '((dijon . 335)(nancy . 145)))

(set-distances 'dijon '((strasbourg . 335)(lyon . 192)(paris . 313)(nancy . 201)))
(set-distances 'lyon '((grenoble . 104)(avignon . 216)(limoges . 389)(dijon . 192)))

(set-distances 'grenoble '((avignon . 227)(lyon . 104)))
(set-distances 'avignon '((grenoble . 227)(marseille . 99)(montpellier . 121)(lyon . 216)))

(set-distances 'marseille '((nice . 188)(avignon . 99)))
(set-distances 'nice '((marseille . 188)))

(set-distances 'montpellier '((avignon . 121)(toulouse . 240)))
(set-distances 'toulouse '((montpellier . 240)(bordeaux . 253)(limoges . 313)))

(set-distances 'bordeaux '((limoges . 220)(toulouse . 253)(nantes . 329)))
(set-distances 'limoges '((lyon . 389)(toulouse . 313)(bordeaux . 220)(nantes . 329)(paris . 396)))

(set-distances 'nantes '((limoges . 329)(bordeaux . 329)(rennes . 107)))
(set-distances 'paris '((calais . 297)(nancy . 372)(dijon . 313)(limoges . 396)(rennes . 348)(caen . 241)))


(let ((f-values (make-hash-table :size 20))
      (g-values (make-hash-table :size 20)) )
  (defun set-f-value (x y)
    (setf (gethash x f-values) y) )
  (defun get-f-value (x)
    (gethash x f-values) )
  (defun set-g-value (x y)
    (setf (gethash x g-values) y) )
  (defun get-g-value (x)
    (gethash x g-values) )
  )


(let ((longitude-info (make-hash-table :size 20)))
  (defun set-longitude (x y)
    (setf (gethash x longitude-info) y) )
  (defun get-longitude (x)
    (gethash x longitude-info) )
 )


(mapcar #'(lambda (pair) (apply #'set-longitude pair))
	'((avignon 48)(bordeaux -6)(brest -45)(caen -4)
	  (calais 18)(dijon 51)(grenoble 57)(limoges 12)
	  (lyon 48)(marseille 53)(montpellier 36)
	  (nantes -16)(nancy 62)(nice 73)(paris 23)
	  (rennes -17)(strasbourg 77)(toulouse 14) ) )

(defun a-star-search (start-node goal-node)
  (set-goal goal-node)
  (let ((open (list start-node))                
        (closed nil)
        x
        successors)
    (set-predecessor start-node nil)
    (set-g-value start-node 0)
    (set-f-value start-node (f start-node))
    (loop
      (if (null open)(return 'failure))         
      (setf x (select-best open))               
      (setf open (remove x open))               
      (push x closed)
      (if (eql x (get-goal))
          (return (extract-path x)) )           
      (setf successors (get-successors x))      
      (dolist (y successors)                    
        (if (not (or (member y open)
                     (member y closed) ))
          (progn
            (increment-count)
            (set-g-value y (g y x))
            (set-f-value y (f y))
            (setf open (insert y open))
            (set-predecessor y x) )
          (let* ((z (get-predecessor y))
                (temp (if z
                        (+ (- (get-f-value y)
                              (get-g-value z)
                              (arc-dist z y) )
                           (get-g-value x)
                           (arc-dist x y) )
                        (get-f-value y) ) ) )
            (if (< temp (get-f-value y))
              (progn
                (set-g-value y
                      (+ (- (get-g-value y)
                            (get-f-value y) )
                         temp) )
                (set-f-value y temp)
                (set-predecessor y x)
                (if (member y open)
                  (progn
                    (setf open (remove y open))
                    (setf open (insert y open)) ) )
                (if (member y closed)
                  (progn
                    (setf open (insert y open))
                    (setf closed
                          (remove y closed) ) ) ) ) ) ) ) )
       ) ) )


(let (goal)
  (defun set-goal (the-goal) (setf goal the-goal))
(defun get-goal () goal) )

(defun f (n)
  (+ (get-g-value n) (h n)) )

(defun g (node x)
  (+ (get-g-value x) (arc-dist x node)) )

(defun h (n)
  (* 10 (longitude-diff n (get-goal))) )

(defun longitude-diff (n1 n2)
  (abs (- (get-longitude n1) (get-longitude n2))) )

(defun select-best (lst)
  (if (eql (first lst) (get-goal))
      (first lst)
    (better (first lst)(rest lst)) ) )

(defun better (elt lst)
  (cond ((null lst) elt)
        ((< (get-f-value elt)(get-f-value (first lst)))
         elt)
        ((eql (first lst) (get-goal))
         (first lst) )
        (t (better elt (rest lst))) ) )

(defun insert (node lst)
  (cond ((null lst)(list node))
        ((< (get-f-value node)
            (get-f-value (first lst)) )
         (cons node lst) )
        (t (cons (first lst)
                 (insert node (rest lst)) )) ) )

(defun extract-path (n)
  (cond ((null n) nil)
        (t (append (extract-path (get-predecessor n))
                   (list n) )) ) )

(defun get-successors (n)
  (mapcar #'first (get-distances n)) )

(defconstant big-distance 9999)

(defun arc-dist (n1 n2) 
  (or (rest (assoc n1 (get-distances n2))) big-distance) )

(let (expansion-count)
  (defun initialize-count () (setf expansion-count 0))
  (defun increment-count () (incf expansion-count))
  (defun get-count () expansion-count) )


(defun look (start end)
  (initialize-count)
  (format t "A-star-search solution: ~s.~%"
    (a-star-search start end) )
  (format t "Path-length: ~s.~%" 
    (get-f-value end) )
  (format t "~s nodes expanded.~%"
    (get-count) )
  )

